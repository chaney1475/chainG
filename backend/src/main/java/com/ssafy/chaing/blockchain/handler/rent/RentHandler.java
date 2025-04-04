package com.ssafy.chaing.blockchain.handler.rent;

import com.ssafy.chaing.blockchain.config.Web3jConnectionManager;
import com.ssafy.chaing.blockchain.handler.rent.input.RentInput;
import com.ssafy.chaing.blockchain.handler.rent.output.RentOutput;
import com.ssafy.chaing.blockchain.provider.CustomGasProvider;
import com.ssafy.chaing.blockchain.web3j.RentManager;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.web3j.abi.datatypes.DynamicStruct;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;

@Slf4j
@Component
public class RentHandler {

    private final Web3jConnectionManager connectionManager;
    private final Credentials credentials;
    private final long chainId;
    private final String rentAddress;
    private final CustomGasProvider gasProvider;
    private final ConcurrentHashMap<String, Object> accountLocks = new ConcurrentHashMap<>();

    @Autowired
    public RentHandler(Web3jConnectionManager connectionManager,
                       @Qualifier("rentCredentials") Credentials rentCredentials,
                       long chainId,
                       @Value("${web3j.rent-contract-address}") String rentAddress) {
        this.connectionManager = connectionManager;
        this.credentials = rentCredentials;
        this.chainId = chainId;
        this.rentAddress = rentAddress;
        this.gasProvider = new CustomGasProvider();
        log.info("✅ RentHandler 초기화 완료! 계약 주소: {}", rentAddress);
    }

    private RentManager loadRentManager(Web3j web3j) {
        TransactionManager txManager = new RawTransactionManager(web3j, credentials, chainId);
        return RentManager.load(rentAddress, web3j, txManager, gasProvider);
    }

    @Async
    public CompletableFuture<Boolean> addContract(RentInput input) {

        return CompletableFuture.supplyAsync(() -> {
            String accountAddress = credentials.getAddress();
            Object accountLock = accountLocks.computeIfAbsent(accountAddress, k -> new Object());

            TransactionReceipt receipt = null;
            boolean success = false;

            log.info("🔒 [RENT] 계정 [{}] 락 획득 시도...", accountAddress);

            try {
                synchronized (accountLock) {
                    log.info("🔑 [RENT] 계정 [{}] 락 획득 성공! (이제 트랜잭션 보냅니다)", accountAddress);

                    receipt = connectionManager.execute(web3j -> {
                        RentManager localRentManager = loadRentManager(web3j);
                        log.info("🚀 [Rent] 트랜잭션 실행 요청! 계정: {}, 노드: {}", accountAddress, connectionManager.getCurrentRpcEndpoint());

                        // 실제 트랜잭션 전송 (이 부분이 Nonce를 사용)
                        return localRentManager.addTransaction(
                                input.getId(),
                                input.getContractId(),
                                input.getMonth(),
                                input.getFrom(),
                                input.getTo(),
                                input.getAmount(),
                                input.getStatus(),
                                input.getTime()
                        ).send();
                    });
                }

                log.info("🔓 [RENT] 계정 [{}] 락 해제됨. (트랜잭션 결과 처리 시작)", accountAddress);

                success = receipt != null && receipt.isStatusOK();
                String resultEmoji = success ? "😄 성공" : "😥 실패";
                log.info("✅ [Rent] 트랜잭션 전송 결과 - 계정 {}: {}", accountAddress, resultEmoji);

            } catch (Exception e) {
                log.error("🚨 [Rent] 트랜잭션 처리 중 에러 발생! 계정: {}, 이유: {}", accountAddress, e.getMessage(), e);
                success = false;
            }

            return success;
        });
    }

    public List<?> getAllTransactions() {
        try {
            return connectionManager.execute(web3j -> {
                RentManager localRentManager = loadRentManager(web3j);
                log.info("📜 [Rent] 모든 트랜잭션 조회 시작... 노드: {}", connectionManager.getCurrentRpcEndpoint());
                return localRentManager.getAllTransactions().send();
            });
        } catch (Exception e) {
            log.error("🚨 [Rent] 모든 트랜잭션 조회 실패! 이유: {}", e.getMessage(), e);
            throw new BadRequestException(ExceptionCode.TRANSFER_TRANSACTION_RETRIEVE_FAILED);
        }
    }

    public List<RentOutput> getTransactionsByAccountId(BigInteger accountId) {
        try {
            List<?> rawList = connectionManager.execute(web3j -> {
                RentManager localRentManager = loadRentManager(web3j);
                log.info("👤 [Rent] 계정 ID [{}] 트랜잭션 조회 시작... 노드: {}", accountId, connectionManager.getCurrentRpcEndpoint());
                return localRentManager.getTransactionsByAccount(accountId).send();
            });

            List<RentOutput> dtoList = new ArrayList<>();
            if (rawList != null) {
                for (Object obj : rawList) {
                    if (obj instanceof DynamicStruct) {
                        DynamicStruct struct = (DynamicStruct) obj;
                        try {
                            List<Object> values = struct.getNativeValueCopy();
                            RentOutput dto = new RentOutput(
                                    (BigInteger) values.get(0), (BigInteger) values.get(1),
                                    (BigInteger) values.get(2), (String) values.get(3),
                                    (String) values.get(4), (BigInteger) values.get(5),
                                    (Boolean) values.get(6), (String) values.get(7)
                            );
                            dtoList.add(dto);
                        } catch (Exception castingException){
                            log.error("❌ 데이터 변환 오류! DynamicStruct -> RentOutput 실패. 데이터: {}, 오류: {}", struct, castingException.getMessage());
                        }
                    } else {
                        log.warn("🤔 예상치 못한 데이터 타입 발견! 타입: {}", obj != null ? obj.getClass().getName() : "null");
                    }
                }
            }
            return dtoList;

        } catch (Exception e) {
            log.error("🚨 [Rent] 계정 ID [{}] 트랜잭션 조회 실패! 이유: {}", accountId, e.getMessage(), e);
            throw new BadRequestException(ExceptionCode.TRANSFER_TRANSACTION_RETRIEVE_FAILED);
        }
    }
}
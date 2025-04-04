package com.ssafy.chaing.blockchain.handler.utility; // 패키지 경로는 맞게 수정하세요

// --- 필요한 Import 문들 ---

import com.ssafy.chaing.blockchain.config.Web3jConnectionManager;
import com.ssafy.chaing.blockchain.handler.utility.input.UtilityInput;
import com.ssafy.chaing.blockchain.handler.utility.output.UtilityOutput;
import com.ssafy.chaing.blockchain.provider.CustomGasProvider;
import com.ssafy.chaing.blockchain.web3j.UtilityManager;
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


@Slf4j // 로깅을 위해 추가
@Component
public class UtilityHandler {
    // --- 수정: 의존성 변경 ---
    private final Web3jConnectionManager connectionManager;
    private final Credentials credentials;
    private final long chainId;
    private final String utilityAddress;
    private final CustomGasProvider gasProvider;
    private final ConcurrentHashMap<String, Object> accountLocks = new ConcurrentHashMap<>();

    // UtilityManager 인스턴스는 더 이상 final 필드가 아님

    @Autowired
    public UtilityHandler(Web3jConnectionManager connectionManager, // 수정
                          @Qualifier("utilityCredentials") Credentials utilityCredentials, // 수정
                          long chainId, // 수정 (Web3jConfig에서 빈으로 등록된 것 주입)
                          @Value("${web3j.utility-contract-address}") String utilityAddress) { // 수정: Value 키 변경
        this.connectionManager = connectionManager;
        this.credentials = utilityCredentials;
        this.chainId = chainId;
        this.utilityAddress = utilityAddress;
        this.gasProvider = new CustomGasProvider(); // 필요 시 빈으로 등록하여 주입
        log.info("✅ UtilityHandler 초기화 완료! 계약 주소: {}", utilityAddress);
    }

    // --- Helper Method to load UtilityManager within execute context ---
    private UtilityManager loadUtilityManager(Web3j web3j) {
        // execute 콜백 내에서 현재 활성 web3j 인스턴스로 TransactionManager 생성
        TransactionManager txManager = new RawTransactionManager(web3j, credentials, chainId);
        // UtilityManager 로드
        return UtilityManager.load(utilityAddress, web3j, txManager, gasProvider);
    }

    // --- Utility Contract Methods adapted to use Web3jConnectionManager ---

    @Async
    public CompletableFuture<Boolean> addContract(UtilityInput input) {
        return CompletableFuture.supplyAsync(() -> {
            String accountAddress = credentials.getAddress();
            Object accountLock = accountLocks.computeIfAbsent(accountAddress, k -> new Object());

            TransactionReceipt receipt;
            boolean success;

            log.info("🔒 [UTILITY] 계정 [{}] 락 획득 시도...", accountAddress);

            try {
                synchronized (accountLock) {
                    log.info("🔑 [UTILITY] 계정 [{}] 락 획득 성공! (이제 트랜잭션 보냅니다)", accountAddress);

                    receipt = connectionManager.execute(web3j -> {
                        UtilityManager localRentManager = loadUtilityManager(web3j);
                        log.info("🚀 [UTILITY] 트랜잭션 실행 요청! 계정: {}, 노드: {}", accountAddress,
                                connectionManager.getCurrentRpcEndpoint());

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

                log.info("🔓 [UTILITY] 계정 [{}] 락 해제됨. (트랜잭션 결과 처리 시작)", accountAddress);

                success = receipt != null && receipt.isStatusOK();
                String resultEmoji = success ? "😄 성공" : "😥 실패";
                log.info("✅ [Utility] 트랜잭션 전송 결과 - 계정 {}: {}", accountAddress, resultEmoji);

            } catch (Exception e) {
                log.error("🚨 [Utility] 트랜잭션 처리 중 에러 발생! 계정: {}, 이유: {}", accountAddress, e.getMessage(), e);
                success = false;
            }

            return success;
        });
    }

    public List<?> getAllTransactions() {
        try {
            // connectionManager.execute를 사용하여 블록체인 호출
            return connectionManager.execute(web3j -> {
                UtilityManager localUtilityManager = loadUtilityManager(web3j);
                log.info("Executing getAllTransactions (Utility) on: {}", connectionManager.getCurrentRpcEndpoint());
                // 실제 컨트랙트 읽기 함수 호출
                return localUtilityManager.getAllTransactions().send();
            });
        } catch (Exception e) {
            log.error("❗Error retrieving all utility transactions: {}❗", e.getMessage(), e);
            // 애플리케이션 특정 예외로 변환하여 던짐
            throw new BadRequestException(ExceptionCode.TRANSFER_TRANSACTION_RETRIEVE_FAILED);
        }
    }

    // 변환된 DTO 리스트 형태로 반환하도록 수정된 메서드
    public List<UtilityOutput> getTransactionsByAccountId(BigInteger accountId) {
        try {
            // connectionManager.execute를 사용하여 블록체인 호출
            List<?> rawList = connectionManager.execute(web3j -> {
                UtilityManager localUtilityManager = loadUtilityManager(web3j);
                log.info("Executing getTransactionsByAccount (Utility) for Account ID {} on: {}", accountId,
                        connectionManager.getCurrentRpcEndpoint());
                // 실제 컨트랙트 읽기 함수 호출
                return localUtilityManager.getTransactionsByAccount(accountId).send();
            });

            // --- 결과 매핑 로직 (execute 블록 밖에서 수행) ---
            List<UtilityOutput> dtoList = new ArrayList<>();
            if (rawList != null) { // null 체크 추가
                for (Object obj : rawList) {
                    // DynamicStruct 타입 체크 및 변환 (기존 로직 유지)
                    if (obj instanceof DynamicStruct) {
                        DynamicStruct struct = (DynamicStruct) obj;
                        try {
                            List<Object> values = struct.getNativeValueCopy(); // 내부 구현 변경 시 문제될 수 있음
                            UtilityOutput dto = new UtilityOutput(
                                    (BigInteger) values.get(0), // id
                                    (BigInteger) values.get(1), // accountId
                                    (BigInteger) values.get(2), // month
                                    (String) values.get(3),     // from
                                    (String) values.get(4),     // to
                                    (BigInteger) values.get(5), // amount
                                    (Boolean) values.get(6),    // status
                                    (String) values.get(7)      // time
                            );
                            dtoList.add(dto);
                        } catch (Exception castingException) {
                            log.error("Error casting DynamicStruct to UtilityOutput: Struct={}, Error={}", struct,
                                    castingException.getMessage());
                            // 오류 발생 시 해당 항목은 건너뛰거나 기본값 처리 가능
                        }
                    } else {
                        log.warn("Unexpected object type in rawList: {}", obj.getClass().getName());
                    }
                }
            }
            return dtoList;

        } catch (Exception e) {
            log.error("❗Error retrieving utility transactions for Account ID {}: {}❗", accountId, e.getMessage(), e);
            throw new BadRequestException(ExceptionCode.TRANSFER_TRANSACTION_RETRIEVE_FAILED);
        }
    }
}
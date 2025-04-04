package com.ssafy.chaing.blockchain.handler.contract;

import com.ssafy.chaing.blockchain.config.Web3jConnectionManager;
import com.ssafy.chaing.blockchain.handler.contract.input.ContractInput;
import com.ssafy.chaing.blockchain.handler.contract.input.LiveAccountInput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractOverviewOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractRentOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractUtilityOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.LiveAccountOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.PaymentInfoCountOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.PaymentInfoOutput;
import com.ssafy.chaing.blockchain.provider.CustomGasProvider;
import com.ssafy.chaing.blockchain.web3j.ContractManager;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import java.math.BigInteger;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;

@Slf4j
@Component
public class ContractHandler {
    private final Web3jConnectionManager connectionManager;
    private final Credentials credentials;
    private final long chainId;
    private final String contractAddress;
    private final CustomGasProvider gasProvider;
    private final ConcurrentHashMap<String, Object> accountLocks = new ConcurrentHashMap<>();

    @Autowired
    public ContractHandler(Web3jConnectionManager connectionManager,
                           @Qualifier("contractCredentials") Credentials contractsCredentials,
                           long chainId,
                           @Value("${web3j.contract-address}") String contractAddress) {
        log.info("ContractHandler initialized for contract address: {}", contractAddress);
        this.connectionManager = connectionManager;
        this.credentials = contractsCredentials;
        this.chainId = chainId;
        this.contractAddress = contractAddress;
        this.gasProvider = new CustomGasProvider(); // 필요 시 빈으로 등록하여 주입받아도 됨
    }

    private ContractManager loadContractManager(Web3j web3j) {
        TransactionManager txManager = new RawTransactionManager(web3j, credentials, chainId);
        return ContractManager.load(contractAddress, web3j, txManager, gasProvider);
    }

    @Async
    public CompletableFuture<Boolean> addContract(ContractInput input) {

        return CompletableFuture.supplyAsync(() -> {
            String accountAddress = credentials.getAddress();
            Object accountLock = accountLocks.computeIfAbsent(accountAddress, k -> new Object());

            TransactionReceipt receipt;
            boolean success = false;

            log.info("🔒 [CONTRACT] 계정 [{}] 락 획득 시도...", accountAddress);

            try {
                synchronized (accountLock) {
                    log.info("🔑 [CONTRACT] 계정 [{}] 락 획득 성공! (이제 트랜잭션 보냅니다)", accountAddress);

                    receipt = connectionManager.execute(web3j -> {
                        ContractManager localContractManager = loadContractManager(web3j);
                        log.info("🚀 [CONTRACT] 트랜잭션 실행 요청! 계정: {}, 노드: {}", accountAddress,
                                connectionManager.getCurrentRpcEndpoint());

                        List<ContractManager.PaymentInfo> paymentInfos = input.getPaymentInfos().stream()
                                .map(pi -> new ContractManager.PaymentInfo(
                                        pi.getUserId(),
                                        pi.getAmount(),
                                        pi.getRatio()
                                ))
                                .toList();

                        return localContractManager.addContract(
                                input.getId(), input.getStartDate(), input.getEndDate(),
                                input.getRentTotalAmount(), input.getRentDueDate(), input.getRentAccountNo(),
                                input.getOwnerAccountNo(), input.getRentTotalRatio(), paymentInfos,
                                input.getLiveAccountNo(), input.getIsUtilityEnabled(), input.getUtilitySplitRatio(),
                                input.getCardId()
                        ).send();
                    });
                }

                log.info("🔓 [CONTRACT] 계정 [{}] 락 해제됨. (트랜잭션 결과 처리 시작)", accountAddress);

                success = receipt != null && receipt.isStatusOK();
                String resultEmoji = success ? "😄 성공" : "😥 실패";
                log.info("✅ [CONTRACT] 트랜잭션 전송 결과 - 계정 {}: {}", accountAddress, resultEmoji);
                return success;
            } catch (Exception e) {
                log.error("🚨 [CONTRACT] 트랜잭션 처리 중 에러 발생! 계정: {}, 이유: {}", accountAddress, e.getMessage(), e);
                return false; // 비동기 작업 실패 시 false 반환
            }
        });
    }

    public List<?> getAllContracts() {
        try {
            return connectionManager.execute(web3j -> {
                ContractManager localContractManager = loadContractManager(web3j);
                log.info("Executing getAllContracts on: {}", connectionManager.getCurrentRpcEndpoint());
                return localContractManager.getAllContracts().send();
            });
        } catch (Exception e) {
            log.error("❗getAllContracts error: {}❗", e.getMessage(), e);
            throw new BadRequestException(ExceptionCode.CONTRACT_TRANSACTION_RETRIEVE_FAILED);
        }
    }

    public ContractOutput getContract(BigInteger id) {
        try {
            var tuple = connectionManager.execute(web3j -> {
                ContractManager localContractManager = loadContractManager(web3j);
                log.info("Executing getFullContractData for ID {} on: {}", id,
                        connectionManager.getCurrentRpcEndpoint());
                return localContractManager.getFullContractData(id).send();
            });

            List<PaymentInfoOutput> dtos = tuple.component9().stream()
                    .map(paymentInfo -> new PaymentInfoOutput(
                            paymentInfo.userId,
                            paymentInfo.amount,
                            paymentInfo.ratio))
                    .toList();

            return new ContractOutput(
                    tuple.component1(), tuple.component2(), tuple.component3(),
                    tuple.component4(), tuple.component5(), tuple.component6(),
                    tuple.component7(), tuple.component8(), dtos,
                    tuple.component10(), tuple.component11(), tuple.component12(),
                    tuple.component13()
            );
        } catch (Exception e) {
            log.error("❗getContract error for ID {}: {}❗", id, e.getMessage(), e);
            throw new BadRequestException(ExceptionCode.CONTRACT_TRANSACTION_RETRIEVE_FAILED);
        }
    }

    // ... (getContractOverview, getPaymentInfoCount 등 다른 읽기 메서드들도 유사하게 수정) ...
    // 예시: getContractOverview
    public ContractOverviewOutput getContractOverview(BigInteger id) {
        try {
            var tuple = connectionManager.execute(web3j -> {
                ContractManager localContractManager = loadContractManager(web3j);
                log.info("Executing getContractOverview for ID {} on: {}", id,
                        connectionManager.getCurrentRpcEndpoint());
                return localContractManager.getContractOverview(id).send();
            });
            return new ContractOverviewOutput(tuple.component1(), tuple.component2(), tuple.component3());
        } catch (Exception e) {
            log.error("❗getContractOverview error for ID {}: {}❗", id, e.getMessage(), e);
            throw new BadRequestException(ExceptionCode.CONTRACT_TRANSACTION_RETRIEVE_FAILED);
        }
    }

    public PaymentInfoCountOutput getPaymentInfoCount(BigInteger id) {
        try {
            BigInteger count = connectionManager.execute(web3j -> {
                ContractManager localContractManager = loadContractManager(web3j);
                log.info("Executing getPaymentInfoCount for ID {} on: {}", id,
                        connectionManager.getCurrentRpcEndpoint());
                return localContractManager.getPaymentInfoCount(id).send();
            });
            return new PaymentInfoCountOutput(count);
        } catch (Exception e) {
            log.error("❗getContractOverview error for ID {}: {}❗", id, e.getMessage(), e);
            throw new BadRequestException(ExceptionCode.CONTRACT_TRANSACTION_RETRIEVE_FAILED);
        }
    }

    public PaymentInfoOutput getPaymentInfoByIndex(BigInteger id, BigInteger index) {
        try {
            var tuple = connectionManager.execute(web3j -> {
                ContractManager localContractManager = loadContractManager(web3j);
                log.info("Executing getPaymentInfoByIndex for ID {} on: {}", id,
                        connectionManager.getCurrentRpcEndpoint());
                return localContractManager.getPaymentInfoByIndex(id, index).send();
            });
            return new PaymentInfoOutput(tuple.component1(), tuple.component2(), tuple.component3());
        } catch (Exception e) {
            log.error("❗getContractOverview error for ID {}: {}❗", id, e.getMessage(), e);
            throw new BadRequestException(ExceptionCode.CONTRACT_TRANSACTION_RETRIEVE_FAILED);
        }
    }

    public ContractRentOutput getRentData(BigInteger id) {
        try {
            var tuple = connectionManager.execute(web3j -> {
                ContractManager localContractManager = loadContractManager(web3j);
                log.info("Executing getRentData for ID {} on: {}", id,
                        connectionManager.getCurrentRpcEndpoint());
                return localContractManager.getRentData(id).send();
            });
            return new ContractRentOutput(
                    tuple.component1(),
                    tuple.component2(),
                    tuple.component3(),
                    tuple.component4(),
                    tuple.component5(),
                    tuple.component6()
            );
        } catch (Exception e) {
            throw new BadRequestException(ExceptionCode.CONTRACT_TRANSACTION_RETRIEVE_FAILED);
        }
    }

    public ContractUtilityOutput getUtilityData(BigInteger id) {
        try {
            var tuple = connectionManager.execute(web3j -> {
                ContractManager contractManager = loadContractManager(web3j);
                log.info("Executing getUtilityData for ID {} on: {}", id,
                        connectionManager.getCurrentRpcEndpoint());
                return contractManager.getUtilityData(id).send();
            });
            return new ContractUtilityOutput(
                    tuple.component1(),
                    tuple.component2(),
                    tuple.component3()
            );
        } catch (Exception e) {
            throw new BadRequestException(ExceptionCode.CONTRACT_TRANSACTION_RETRIEVE_FAILED);
        }
    }

    public boolean addLiveAccount(BigInteger contractId, LiveAccountInput input) {
        try {
            TransactionReceipt receipt = connectionManager.execute(web3j -> {
                ContractManager localContractManager = loadContractManager(web3j);
                log.info("Executing updateLiveAccountNo for Contract ID {} on: {}", contractId,
                        connectionManager.getCurrentRpcEndpoint());
                return localContractManager.updateLiveAccountNo(contractId, input.getLiveAccountNo()).send();
            });
            boolean success = receipt != null && receipt.isStatusOK();
            log.info("addLiveAccount Transaction status for Contract ID {}: {}", contractId, success);
            return success;
        } catch (Exception e) {
            log.error("❗addLiveAccount error for Contract ID {}: {}❗", contractId, e.getMessage(), e);
            return false;
        }
    }

    public LiveAccountOutput getLiveAccount(BigInteger contractId) {
        try {
            String liveAccountNo = connectionManager.execute(web3j -> {
                ContractManager localContractManager = loadContractManager(web3j);
                log.info("Executing getLiveAccountNo for Contract ID {} on: {}", contractId,
                        connectionManager.getCurrentRpcEndpoint());
                return localContractManager.getLiveAccountNo(contractId).send();
            });
            return new LiveAccountOutput(liveAccountNo);
        } catch (Exception e) {
            log.error("❗getLiveAccount error for Contract ID {}: {}❗", contractId, e.getMessage(), e);
            throw new BadRequestException(ExceptionCode.LIVE_ACCOUNT_RETRIEVE_FAILED);
        }
    }
}

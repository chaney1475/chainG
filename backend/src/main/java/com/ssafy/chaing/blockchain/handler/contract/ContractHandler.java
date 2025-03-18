package com.ssafy.chaing.blockchain.handler.contract;

import com.ssafy.chaing.blockchain.handler.contract.input.ContractInput;
import com.ssafy.chaing.blockchain.handler.contract.input.LiveAccountInput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractOverviewOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.LiveAccountOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.PaymentInfoCountOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.PaymentInfoOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractRentOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractUtilityOutput;
import com.ssafy.chaing.blockchain.provider.CustomGasProvider;
import com.ssafy.chaing.blockchain.web3j.ContractManager;
import java.math.BigInteger;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tuples.generated.Tuple3;
import org.web3j.tx.TransactionManager;

@Component
public class ContractHandler {
    private final Web3j web3j;
    private final TransactionManager txManager;

    private final String contractAddress;

    private final ContractManager contractManager;

    @Autowired
    public ContractHandler(Web3j web3j, TransactionManager txManager,
                           @Value("${web3j.contract-address}") String contractAddress) {
        this.web3j = web3j;
        this.txManager = txManager;
        this.contractAddress = contractAddress;
        // ContractManager 인스턴스 초기화
        this.contractManager = ContractManager.load(contractAddress, web3j, txManager,
                new CustomGasProvider());
    }


    public String addContract(ContractInput input) throws Exception {
        try {
            // DTO의 PaymentInfo 리스트를 ContractManager의 PaymentInfo 객체로 변환
            List<ContractManager.PaymentInfo> paymentInfos = input.getPaymentInfos().stream()
                    .map(pi -> new ContractManager.PaymentInfo(
                            pi.getUserId(),
                            pi.getAmount(),
                            pi.getRatio()
                    ))
                    .toList();

            // 컨트랙트의 addContract 함수 호출 후 트랜잭션 해시 반환
            TransactionReceipt receipt = contractManager.addContract(
                    input.getId(),
                    input.getStartDate(),
                    input.getEndDate(),
                    input.getRentTotalAmount(),
                    input.getRentDueDate(),
                    input.getRentAccountNo(),
                    input.getOwnerAccountNo(),
                    input.getRentTotalRatio(),
                    paymentInfos,
                    input.getLiveAccountNo(),
                    input.getIsUtilityEnabled(),
                    input.getUtilitySplitRatio(),
                    input.getCardId()
            ).send();

            return "addContract success";
        } catch (Exception e) {
            return "addContract fail";
        }
    }

    public List<?> getAllContracts() throws Exception {
        return contractManager.getAllContracts().send();
    }

    public ContractOutput getContract(BigInteger id) throws Exception {
        var tuple = contractManager.getFullContractData(id).send();

        List<PaymentInfoOutput> dtos = tuple.component9().stream()
                .map(paymentInfo -> new PaymentInfoOutput(
                        paymentInfo.userId,
                        paymentInfo.amount,
                        paymentInfo.ratio))
                .toList();

        return new ContractOutput(
                tuple.component1(),
                tuple.component2(),
                tuple.component3(),
                tuple.component4(),
                tuple.component5(),
                tuple.component6(),
                tuple.component7(),
                tuple.component8(),
                dtos,
                tuple.component10(),
                tuple.component11(),
                tuple.component12(),
                tuple.component13()
        );
    }

    public ContractOverviewOutput getContractOverview(BigInteger id) throws Exception {
        var tuple = contractManager.getContractOverview(id).send();
        return new ContractOverviewOutput(tuple.component1(), tuple.component2(), tuple.component3());
    }

    public PaymentInfoCountOutput getPaymentInfoCount(BigInteger id) throws Exception {
        BigInteger count = contractManager.getPaymentInfoCount(id).send();
        return new PaymentInfoCountOutput(count);
    }

    public PaymentInfoOutput getPaymentInfoByIndex(BigInteger id, BigInteger index) throws Exception {
        Tuple3<BigInteger, BigInteger, BigInteger> tuple = contractManager.getPaymentInfoByIndex(id, index).send();
        return new PaymentInfoOutput(tuple.component1(), tuple.component2(), tuple.component3());
    }

    public ContractRentOutput getRentData(BigInteger id) throws Exception {
        var tuple = contractManager.getRentData(id).send();
        return new ContractRentOutput(
                tuple.component1(),
                tuple.component2(),
                tuple.component3(),
                tuple.component4(),
                tuple.component5(),
                tuple.component6()
        );
    }

    public ContractUtilityOutput getUtilityData(BigInteger id) throws Exception {
        var tuple = contractManager.getUtilityData(id).send();
        return new ContractUtilityOutput(
                tuple.component1(),
                tuple.component2(),
                tuple.component3()
        );
    }

    public String addLiveAccount(BigInteger contractId, LiveAccountInput input) throws Exception {
        TransactionReceipt receipt = contractManager.updateLiveAccountNo(contractId, input.getLiveAccountNo())
                .send();
        if (receipt.isStatusOK()) {
            return "addLiveAccount success";
        } else {
            return "addLiveAccount fail";
        }
    }

    public LiveAccountOutput getLiveAccount(BigInteger contractId) throws Exception {
        String liveAccountNo = contractManager.getLiveAccountNo(contractId).send();
        return new LiveAccountOutput(liveAccountNo);
    }
}

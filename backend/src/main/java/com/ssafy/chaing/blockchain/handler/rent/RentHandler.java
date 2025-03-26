package com.ssafy.chaing.blockchain.handler.rent;

import com.ssafy.chaing.blockchain.handler.rent.input.RentInput;
import com.ssafy.chaing.blockchain.handler.rent.output.RentOutput;
import com.ssafy.chaing.blockchain.provider.CustomGasProvider;
import com.ssafy.chaing.blockchain.web3j.RentManager;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.web3j.abi.datatypes.DynamicStruct;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.TransactionManager;

@Component
public class RentHandler {
    private final Web3j web3j;
    private final TransactionManager txManager;

    private final String rentAddress;

    private final RentManager rentManager;

    @Autowired
    public RentHandler(Web3j web3j, TransactionManager txManager,
                       @Value("${web3j.rent-contract-address}") String rentAddress) {
        this.web3j = web3j;
        this.txManager = txManager;
        this.rentAddress = rentAddress;
        // ContractManager 인스턴스 초기화
        this.rentManager = RentManager.load(rentAddress, web3j, txManager,
                new CustomGasProvider());
    }


    public String addContract(RentInput input) throws Exception {
        try {
            // 컨트랙트의 addContract 함수 호출 후 트랜잭션 해시 반환
            TransactionReceipt receipt = rentManager.addTransaction(
                    input.getId(),
                    input.getAccountId(),
                    input.getMonth(),
                    input.getFrom(),
                    input.getTo(),
                    input.getAmount(),
                    input.getStatus(),
                    input.getTime()
            ).send();

            return "addContract success";
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    public List<?> getAllTransactions() throws Exception {
        try {
            return rentManager.getAllTransactions().send();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // 변환된 DTO 리스트 형태로 반환하도록 수정된 메서드
    public List<RentOutput> getTransactionsByAccountId(BigInteger accountId) throws Exception {
        try {
            List<?> rawList = rentManager.getTransactionsByAccount(accountId).send();
            // 각 항목을 RentTransactionDTO로 변환
            List<RentOutput> dtoList = new ArrayList<>();
            for (Object obj : rawList) {
                if (obj instanceof DynamicStruct) {
                    DynamicStruct struct = (DynamicStruct) obj;
                    List<Object> values = struct.getNativeValueCopy();
                    RentOutput dto = new RentOutput(
                            (BigInteger) values.get(0),
                            (BigInteger) values.get(1),
                            (BigInteger) values.get(2),
                            (String) values.get(3),
                            (String) values.get(4),
                            (BigInteger) values.get(5),
                            (Boolean) values.get(6),
                            (String) values.get(7)
                            );

                    dtoList.add(dto);
                }
            }
            return dtoList;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}

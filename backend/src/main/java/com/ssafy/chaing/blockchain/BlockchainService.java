package com.ssafy.chaing.blockchain;

import com.ssafy.chaing.blockchain.handler.contract.ContractHandler;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractOutput;
import com.ssafy.chaing.blockchain.handler.rent.RentHandler;
import com.ssafy.chaing.blockchain.handler.rent.output.RentOutput;
import com.ssafy.chaing.blockchain.handler.utility.UtilityHandler;
import com.ssafy.chaing.blockchain.handler.utility.output.UtilityOutput;
import com.ssafy.chaing.blockchain.portfolio.output.ContractPortfolio;
import java.math.BigInteger;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlockchainService {

    private final ContractHandler contractHandler;
    private final RentHandler rentHandler;
    private final UtilityHandler utilityHandler;

    public ContractPortfolio getContractPortfolio(Long contractId, Long accountId) throws Exception {
        BigInteger cid = BigInteger.valueOf(contractId);
        BigInteger aid = BigInteger.valueOf(accountId);

        ContractOutput contract = contractHandler.getContract(cid);
        List<RentOutput> rent = rentHandler.getTransactionsByAccountId(aid);
        List<UtilityOutput> utility = utilityHandler.getTransactionsByAccountId(aid);

        return new ContractPortfolio(contract, rent, utility);
    }
}

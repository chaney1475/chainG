package com.ssafy.chaing.blockchain.service;

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
public class BlockchainServiceImpl implements BlockchainService {

    private final ContractHandler contractHandler;
    private final RentHandler rentHandler;
    private final UtilityHandler utilityHandler;

    @Override
    public ContractPortfolio getContractPortfolio(
            Long contractId
    ) throws Exception {
        BigInteger cid = BigInteger.valueOf(contractId);
        ContractOutput contract = contractHandler.getContract(cid);
        return new ContractPortfolio(contract);
    }

    @Override
    public String createContractPDF(
            ContractPortfolio portfolio
    ) throws Exception {
        return "";
    }

    @Override
    public String createRentPDF(List<RentOutput> rent) throws Exception {
        return "";
    }

    @Override
    public String createUtilityPDF(List<UtilityOutput> utility) throws Exception {
        return "";
    }
}

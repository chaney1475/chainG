package com.ssafy.chaing.blockchain.service;

import com.ssafy.chaing.blockchain.handler.rent.output.RentOutput;
import com.ssafy.chaing.blockchain.handler.utility.output.UtilityOutput;
import com.ssafy.chaing.blockchain.portfolio.output.ContractPortfolio;
import java.util.List;

public interface BlockchainService {
    ContractPortfolio getContractPortfolio(Long contractId) throws Exception;
    String createContractPDF(ContractPortfolio portfolio) throws Exception;
    String createRentPDF(List<RentOutput> rent) throws Exception;
    String createUtilityPDF(List<UtilityOutput> utility) throws Exception;
}

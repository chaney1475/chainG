package com.ssafy.chaing.blockchain.service;

import com.ssafy.chaing.blockchain.portfolio.output.ContractPortfolio;
import com.ssafy.chaing.blockchain.portfolio.output.TransferPortfolioList;
import com.ssafy.chaing.blockchain.service.dto.PDFPathDTO;

public interface BlockchainService {
    ContractPortfolio getContractPortfolio(Long contractId);

    TransferPortfolioList getTransferPortfolio(Long contractId);

    PDFPathDTO createContractPDF(ContractPortfolio portfolio);

    PDFPathDTO createTransferPDF(TransferPortfolioList portfolioList);

}

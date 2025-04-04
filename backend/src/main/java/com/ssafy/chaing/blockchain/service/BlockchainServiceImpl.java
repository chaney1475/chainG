package com.ssafy.chaing.blockchain.service;

import com.ssafy.chaing.blockchain.handler.contract.ContractHandler;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractOutput;
import com.ssafy.chaing.blockchain.handler.rent.RentHandler;
import com.ssafy.chaing.blockchain.handler.rent.output.RentOutput;
import com.ssafy.chaing.blockchain.handler.utility.UtilityHandler;
import com.ssafy.chaing.blockchain.handler.utility.output.UtilityOutput;
import com.ssafy.chaing.blockchain.pdf.ContractPdfGenerator;
import com.ssafy.chaing.blockchain.pdf.PDFGenerator;
import com.ssafy.chaing.blockchain.pdf.TransferPortfolioPdfGenerator;
import com.ssafy.chaing.blockchain.portfolio.output.ContractPortfolio;
import com.ssafy.chaing.blockchain.portfolio.output.TransferPortfolio;
import com.ssafy.chaing.blockchain.portfolio.output.TransferPortfolioList;
import com.ssafy.chaing.blockchain.service.dto.PDFPathDTO;
import com.ssafy.chaing.common.util.S3Util;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import com.ssafy.chaing.contract.repository.ContractUserRepository;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlockchainServiceImpl implements BlockchainService {

    private final ContractHandler contractHandler;
    private final RentHandler rentHandler;
    private final UtilityHandler utilityHandler;

    private final ContractUserRepository contractUserRepository;

    private final ContractPdfGenerator contractPDFGenerator;
    private final TransferPortfolioPdfGenerator transferPDFGenerator;

    private final S3Util s3Util;

    @Override
    public ContractPortfolio getContractPortfolio(
            Long contractId
    ) {
        BigInteger cid = BigInteger.valueOf(contractId);
        ContractOutput contract = contractHandler.getContract(cid);
        log.info("Contract: {}", contract.getRentAccountNo());
        return ContractPortfolio.from(contract);
    }

    @Override
    public TransferPortfolioList getTransferPortfolio(
            Long contractId
    ) {
        List<ContractUserEntity> contractUsers = contractUserRepository.findByContractId(contractId);
        List<TransferPortfolio> result = new ArrayList<>();

        for (ContractUserEntity contractUser : contractUsers) {
            BigInteger aid = BigInteger.valueOf(contractUser.getId());
            List<RentOutput> rentOutput = rentHandler.getTransactionsByAccountId(aid);
            List<UtilityOutput> utilityOutputs = utilityHandler.getTransactionsByAccountId(aid);

            result.add(new TransferPortfolio(
                    contractUser.getId(),
                    contractUser.getUser().getName(),
                    rentOutput,
                    utilityOutputs
            ));
        }

        return new TransferPortfolioList(contractId, result);
    }

    @Override
    public PDFPathDTO createContractPDF(
            ContractPortfolio portfolio
    ) {
        String pdfUrl = generatePDF(
                portfolio,
                contractPDFGenerator,
                "contract-" + portfolio.getId()
        );

        return new PDFPathDTO(pdfUrl);
    }

    @Override
    public PDFPathDTO createTransferPDF(
            TransferPortfolioList portfolioList
    ) {
        String pdfUrl = generatePDF(
                portfolioList,
                transferPDFGenerator,
                "contract-" + portfolioList.getContractId()
        );

        return new PDFPathDTO(pdfUrl);
    }

    private <T> String generatePDF(
            T data,
            PDFGenerator<T> generator,
            String baseFileName
    ) {
        byte[] pdfBytes = generator.generate(data);
        return s3Util.uploadPdf(pdfBytes, "pdf/contracts", baseFileName);
    }
}

package com.ssafy.chaing.blockchain.controller;

import com.ssafy.chaing.blockchain.controller.response.PDFPathResponse;
import com.ssafy.chaing.blockchain.handler.contract.ContractHandler;
import com.ssafy.chaing.blockchain.handler.contract.input.ContractInput;
import com.ssafy.chaing.blockchain.handler.rent.RentHandler;
import com.ssafy.chaing.blockchain.handler.rent.input.RentInput;
import com.ssafy.chaing.blockchain.handler.utility.UtilityHandler;
import com.ssafy.chaing.blockchain.handler.utility.input.UtilityInput;
import com.ssafy.chaing.blockchain.portfolio.output.ContractPortfolio;
import com.ssafy.chaing.blockchain.portfolio.output.TransferPortfolioList;
import com.ssafy.chaing.blockchain.service.BlockchainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/blockchain")
@RequiredArgsConstructor
public class BlockchainController {

    private final BlockchainService blockchainService;
    private final ContractHandler contractHandler;
    private final RentHandler rentHandler;
    private final UtilityHandler utilityHandler;

    @PostMapping("/contract/{contractId}/pdf")
    public ResponseEntity<?> createContractPDF(
            @PathVariable("contractId") Long contractId
    ) {
        ContractPortfolio portfolio = blockchainService.getContractPortfolio(contractId);
        PDFPathResponse response = PDFPathResponse.from(blockchainService.createContractPDF(portfolio));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/payment/{contractId}/pdf")
    public ResponseEntity<?> createTransferPDF(
            @PathVariable("contractId") Long contractId
    ) {
        TransferPortfolioList portfolioList = blockchainService.getTransferPortfolio(contractId);
        PDFPathResponse response = PDFPathResponse.from(blockchainService.createTransferPDF(portfolioList));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test/contract")
    public ResponseEntity<?> createContract(
            @RequestBody ContractInput input
    ) {
        boolean response = contractHandler.addContract(input);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test/rent")
    public ResponseEntity<?> createRent(
            @RequestBody RentInput input
    ) {
        boolean response = rentHandler.addContract(input);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test/utility")
    public ResponseEntity<?> createUtility(
            @RequestBody UtilityInput input
    ) {
        boolean response = utilityHandler.addContract(input);
        return ResponseEntity.ok(response);
    }
}

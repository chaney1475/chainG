package com.ssafy.chaing.blockchain.controller;

import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(
            summary = "계약서 PDF 생성",
            description = "스마트 컨트랙트 데이터를 기반으로 계약서 PDF를 생성하고, 생성된 PDF 파일의 경로를 반환합니다."
    )
    @PostMapping("/contract/{contractId}/pdf")
    public ResponseEntity<?> createContractPDF(
            @PathVariable("contractId") Long contractId
    ) {
        ContractPortfolio portfolio = blockchainService.getContractPortfolio(contractId);
        PDFPathResponse response = PDFPathResponse.from(blockchainService.createContractPDF(portfolio));
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "이체 내역 PDF 생성",
            description = "스마트 컨트랙트 기반의 이체 내역을 바탕으로 PDF를 생성하고, PDF 파일 경로를 반환합니다."
    )
    @PostMapping("/payment/{contractId}/pdf")
    public ResponseEntity<?> createTransferPDF(
            @PathVariable("contractId") Long contractId
    ) {
        TransferPortfolioList portfolioList = blockchainService.getTransferPortfolio(contractId);
        PDFPathResponse response = PDFPathResponse.from(blockchainService.createTransferPDF(portfolioList));
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "[테스트] 스마트 계약 등록",
            description = "스마트 계약(Contract)을 블록체인에 등록합니다. 테스트용으로 사용됩니다."
    )
    @PostMapping("/test/contract")
    public ResponseEntity<?> createContract(
            @RequestBody ContractInput input
    ) {
        boolean response = contractHandler.addContract(input);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "[테스트] 공과금 계약 등록",
            description = "공과금(Rent) 스마트 계약을 블록체인에 등록합니다. 테스트용으로 사용됩니다."
    )
    @PostMapping("/test/rent")
    public ResponseEntity<?> createRent(
            @RequestBody RentInput input
    ) {
        boolean response = rentHandler.addContract(input);
        return ResponseEntity.ok(response);
    }


    @Operation(
            summary = "[테스트] 생활비 계약 등록",
            description = "생활비(Utility) 스마트 계약을 블록체인에 등록합니다. 테스트용으로 사용됩니다."
    )
    @PostMapping("/test/utility")
    public ResponseEntity<?> createUtility(
            @RequestBody UtilityInput input
    ) {
        boolean response = utilityHandler.addContract(input);
        return ResponseEntity.ok(response);
    }
}

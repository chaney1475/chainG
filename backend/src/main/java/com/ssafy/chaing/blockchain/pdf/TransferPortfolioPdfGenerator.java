package com.ssafy.chaing.blockchain.pdf;

import com.ssafy.chaing.blockchain.portfolio.output.TransferPortfolioResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TransferPortfolioPdfGenerator implements PDFGenerator<TransferPortfolioResponse> {

    @Override
    public byte[] generate(TransferPortfolioResponse transferPortfolioResponse) {
        return new byte[0];
    }
}
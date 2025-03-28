package com.ssafy.chaing.blockchain.portfolio.output;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TransferPortfolioList {
    private Long contractId;
    private List<TransferPortfolio> transferPortfolioList;
}

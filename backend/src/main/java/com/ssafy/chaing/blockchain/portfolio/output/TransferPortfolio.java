package com.ssafy.chaing.blockchain.portfolio.output;

import com.ssafy.chaing.blockchain.handler.rent.output.RentOutput;
import com.ssafy.chaing.blockchain.handler.utility.output.UtilityOutput;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TransferPortfolio {
    List<RentOutput> rentOutputList;
    List<UtilityOutput> utilityOutputList;
}

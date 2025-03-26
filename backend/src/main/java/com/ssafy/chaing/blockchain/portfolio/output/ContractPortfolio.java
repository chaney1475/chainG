package com.ssafy.chaing.blockchain.portfolio.output;

import com.ssafy.chaing.blockchain.handler.contract.output.ContractOutput;
import com.ssafy.chaing.blockchain.handler.rent.output.RentOutput;
import com.ssafy.chaing.blockchain.handler.utility.output.UtilityOutput;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ContractPortfolio {
    private ContractOutput contractOutput;
    List<RentOutput> rentOutputList;
    List<UtilityOutput> utilityOutputList;
}

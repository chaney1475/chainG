package com.ssafy.chaing.fintech.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import com.ssafy.chaing.fintech.service.common.HeaderDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateFintechCardRequest {

    @JsonProperty("Header")
    private HeaderDTO Header;
    private String cardUniqueNo;
    private String withdrawalAccountNo;
    private String withdrawalDate;

    public CreateFintechCardRequest(HeaderDTO header, String cardUniqueNo, CreateCardCommand command) {
        this.Header = header;
        this.cardUniqueNo = cardUniqueNo;
        this.withdrawalAccountNo = command.accountNo();
        this.withdrawalDate = "5";
    }
}

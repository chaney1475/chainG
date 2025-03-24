package com.ssafy.chaing.fintech.service.request;

import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import com.ssafy.chaing.fintech.service.common.HeaderDTO;
import com.ssafy.chaing.fintech.util.HeaderUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateFintechCardRequest {

    private HeaderDTO Header;
    private String cardUniqueNo;
    private String withdrawalAccountNo;
    private String withdrawalDate;

    public CreateFintechCardRequest from(String cardUniqueNo, CreateCardCommand command){
        HeaderUtil headerUtil = new HeaderUtil();
        HeaderDTO header = headerUtil.createFintechCardHeader();
        log.info("header.apiKey = {}", header.apiKey());
        log.info("header.userKey = {}", header.userKey());
        return new CreateFintechCardRequest(
                headerUtil.createFintechCardHeader(),
                cardUniqueNo,
                command.accountNo(),
                "5"
        );
    }

    public String toString() {
        return "CreateFintechCardRequest [Header=" + Header + ", cardUniqueNo=" + cardUniqueNo + ", withdrawalAccountNo=" + withdrawalAccountNo + ", withdrawalDate=" + withdrawalDate + "]";
    }
}

package com.ssafy.chaing.fintech.controller;

import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.controller.response.FintechResponse;
import com.ssafy.chaing.fintech.service.FintechService;
import com.ssafy.chaing.fintech.service.dto.TransferDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/v1/fintech")
@RestController
public class FintechController {

    private final FintechService fintechService;

    @PostMapping("/transfer")
    public ResponseEntity<BaseResponse<TransferDTO>> transfer(
            @RequestBody TransferCommand body
    ) {
        TransferDTO dto = fintechService.transfer(body);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success(dto));
    }

    @GetMapping("/account/{accountNo}")
    public ResponseEntity<?> getAccountDetail(
            @PathVariable String accountNo
    ) {
        FintechResponse<?> response = fintechService.inquireDemandDepositAccount(accountNo);
        return ResponseEntity.ok(BaseResponse.success(response));
    }

//    @PostMapping("/account/")
//    public ResponseEntity<?> createAccount(
//            @RequestBody String accountTypeUniqueNo
//    ) {
//        FintechResponse<?> response =
//    }
}

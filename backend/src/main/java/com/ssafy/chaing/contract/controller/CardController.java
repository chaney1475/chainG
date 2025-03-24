package com.ssafy.chaing.contract.controller;

import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.contract.controller.request.CreateCardRequest;
import com.ssafy.chaing.contract.controller.response.CreateCardResponse;
import com.ssafy.chaing.contract.service.CardService;
import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/card")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping
    public ResponseEntity<BaseResponse<CreateCardResponse>> createCard(
            @RequestBody CreateCardRequest body) {
        CreateCardCommand command = body.toCommand();

        CreateCardResponse response = CreateCardResponse.from(cardService.registerUtilityCard(command));
        return ResponseEntity.ok(
                BaseResponse.success(
                        response
                )
        );
    }
}

package com.ssafy.chaing.fintech.service;

import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import com.ssafy.chaing.fintech.dto.CreateFintechCardRec;
import com.ssafy.chaing.fintech.service.request.CreateFintechCardRequest;
import com.ssafy.chaing.fintech.service.response.CreateFintechCardResponse;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class FintechServiceImpl implements FintechService {

    @Value( "${ssafy.fintech.card-unique-no}")
    private String cardUniqueNo;

    private String createFintechCardUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/creditCard/createCreditCard";

    private final RestTemplate restTemplate;

    public FintechServiceImpl(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    @Override
    public CreateFintechCardRec createFintechCard(CreateCardCommand command) {
        CreateFintechCardRequest request = new CreateFintechCardRequest();
        request = request.from(cardUniqueNo, command);

        log.info(request.toString());
        // POST 요청 보내고 결과 받기
        ResponseEntity<CreateFintechCardResponse> responseEntity =
                restTemplate.postForEntity(createFintechCardUrl, request, CreateFintechCardResponse.class);

        CreateFintechCardResponse response = responseEntity.getBody();
        return Objects.requireNonNull(response).rec();
    }
}

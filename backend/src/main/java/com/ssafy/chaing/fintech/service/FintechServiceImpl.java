package com.ssafy.chaing.fintech.service;

import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import com.ssafy.chaing.fintech.config.SsafyApiConfig;
import com.ssafy.chaing.fintech.dto.CreateFintechCardRec;
import com.ssafy.chaing.fintech.service.common.HeaderDTO;
import com.ssafy.chaing.fintech.service.request.CreateFintechCardRequest;
import com.ssafy.chaing.fintech.service.response.CreateFintechCardResponse;
import com.ssafy.chaing.fintech.util.HeaderUtil;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class FintechServiceImpl implements FintechService {

    private final SsafyApiConfig config;
    private final RestTemplate restTemplate;
    private final HeaderUtil headerUtil;

    public FintechServiceImpl(RestTemplateBuilder builder, HeaderUtil headerUtil, SsafyApiConfig ssafyApiConfig) {
        this.restTemplate = builder.build();
        this.headerUtil = headerUtil;
        this.config = ssafyApiConfig;
    }

    @Override
    public CreateFintechCardRec createFintechCard(CreateCardCommand command) {
        HeaderDTO requestHeader = headerUtil.createFintechCardHeader();

        CreateFintechCardRequest request = new CreateFintechCardRequest(
                requestHeader,
                config.getCardUniqueNo(),
                command
        );

        ResponseEntity<CreateFintechCardResponse> responseEntity =
                restTemplate.postForEntity(config.getBaseUrl(), request, CreateFintechCardResponse.class);

        CreateFintechCardResponse response = responseEntity.getBody();
        return Objects.requireNonNull(response).rec();
    }
}

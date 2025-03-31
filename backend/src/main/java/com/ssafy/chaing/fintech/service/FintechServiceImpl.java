package com.ssafy.chaing.fintech.service;

import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import com.ssafy.chaing.fintech.config.SsafyApiConfig;
import com.ssafy.chaing.fintech.controller.request.InquireBillingCommand;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.dto.ClientResponseRec;
import com.ssafy.chaing.fintech.dto.CreateFintechCardRec;
import com.ssafy.chaing.fintech.dto.InquireBillingStatementsRec;
import com.ssafy.chaing.fintech.service.common.HeaderWithUserKeyDTO;
import com.ssafy.chaing.fintech.service.dto.TransferDTO;
import com.ssafy.chaing.fintech.service.request.ClientTransferRequest;
import com.ssafy.chaing.fintech.service.request.CreateFintechCardRequest;
import com.ssafy.chaing.fintech.service.request.InquireBillingRequest;
import com.ssafy.chaing.fintech.service.response.ClientErrorResponse;
import com.ssafy.chaing.fintech.service.response.FintechBaseResponse;
import com.ssafy.chaing.fintech.util.ClientErrorParser;
import com.ssafy.chaing.fintech.util.HeaderUtil;
import java.util.List;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
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
        HeaderWithUserKeyDTO requestHeader = headerUtil.createFintechHeaderWithUserKey(
                "createCreditCard", "createCreditCard"
        );

        CreateFintechCardRequest request = new CreateFintechCardRequest(
                requestHeader,
                config.getCardUniqueNo(),
                command
        );

        ResponseEntity<FintechBaseResponse<CreateFintechCardRec>> responseEntity =
                restTemplate.exchange(
                        config.getBaseUrl() + "/creditCard/createCreditCard",
                        HttpMethod.POST,
                        new HttpEntity<>(request),
                        new ParameterizedTypeReference<>() {
                        }
                );

        FintechBaseResponse<CreateFintechCardRec> response = responseEntity.getBody();
        return Objects.requireNonNull(response).rec();
    }

    @Override
    public TransferDTO transfer(TransferCommand command) {
        try {
            HeaderWithUserKeyDTO requestHeader = headerUtil.createFintechHeaderWithUserKey(
                    "updateDemandDepositAccountTransfer", "updateDemandDepositAccountTransfer"
            );

            ClientTransferRequest request = new ClientTransferRequest(
                    requestHeader, command
            );

            ResponseEntity<FintechBaseResponse<List<ClientResponseRec>>> responseEntity =
                    restTemplate.exchange(
                            config.getBaseUrl() + "/demandDeposit/updateDemandDepositAccountTransfer",
                            HttpMethod.POST,
                            new HttpEntity<>(request),
                            new ParameterizedTypeReference<>() {
                            }
                    );

            FintechBaseResponse<List<ClientResponseRec>> response = responseEntity.getBody();

            if (response == null || response.rec() == null) {
                return new TransferDTO(false);
            }

            log.info("송금 성공: {}", response);
            return new TransferDTO(true);

        } catch (HttpClientErrorException e) {
            log.error("송금 실패 - 상태 코드: {}, 응답 내용: {}", e.getStatusCode(), e.getResponseBodyAsString());

            // 🔥 에러 응답 파싱 및 처리
            ClientErrorResponse errorResponse = ClientErrorParser.parseErrorResponse(e.getResponseBodyAsString());
            return new TransferDTO(false);

        } catch (Exception e) {
            log.error("송금 중 알 수 없는 오류 발생: {}", e.getMessage());
            return new TransferDTO(false);
        }

    }

    @Override
    public List<InquireBillingStatementsRec> inquireBillingStatements(InquireBillingCommand command) {
        HeaderWithUserKeyDTO requestHeader = headerUtil.createFintechHeaderWithUserKey(
                "inquireBillingStatements", "inquireBillingStatements"
        );

        InquireBillingRequest request = new InquireBillingRequest(requestHeader, command);

        ResponseEntity<FintechBaseResponse<List<InquireBillingStatementsRec>>> responseEntity =
                restTemplate.exchange(
                        config.getBaseUrl() + "/creditCard/createCreditCard",
                        HttpMethod.POST,
                        new HttpEntity<>(request),
                        new ParameterizedTypeReference<>() {
                        }
                );

        return Objects.requireNonNull(responseEntity.getBody()).rec();
    }

}

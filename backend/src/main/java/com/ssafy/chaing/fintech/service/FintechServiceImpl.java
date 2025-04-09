package com.ssafy.chaing.fintech.service;

import com.ssafy.chaing.blockchain.handler.rent.RentHandler;
import com.ssafy.chaing.blockchain.handler.rent.input.RentInput;
import com.ssafy.chaing.blockchain.handler.utility.UtilityHandler;
import com.ssafy.chaing.blockchain.handler.utility.input.UtilityInput;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.repository.ContractRepository;
import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import com.ssafy.chaing.fintech.config.SsafyApiConfig;
import com.ssafy.chaing.fintech.controller.request.AccountHistoryCommand;
import com.ssafy.chaing.fintech.controller.request.InquireBillingCommand;
import com.ssafy.chaing.fintech.controller.request.ManualTransferCommand;
import com.ssafy.chaing.fintech.controller.request.SimpleTransferCommand;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.controller.response.FintechResponse;
import com.ssafy.chaing.fintech.dto.ClientResponseRec;
import com.ssafy.chaing.fintech.dto.CreateAccountRec;
import com.ssafy.chaing.fintech.dto.CreateFintechCardRec;
import com.ssafy.chaing.fintech.dto.InquireBillingStatementsRec;
import com.ssafy.chaing.fintech.dto.InquireDemandDepositAccountRec;
import com.ssafy.chaing.fintech.dto.InquireTransactionHistoryRec;
import com.ssafy.chaing.fintech.dto.SimpleTransferRec;
import com.ssafy.chaing.fintech.service.common.HeaderWithUserKeyDTO;
import com.ssafy.chaing.fintech.service.dto.TransferDTO;
import com.ssafy.chaing.fintech.service.request.AccountHistoryRequest;
import com.ssafy.chaing.fintech.service.request.ClientTransferRequest;
import com.ssafy.chaing.fintech.service.request.CreateAccountRequest;
import com.ssafy.chaing.fintech.service.request.CreateFintechCardRequest;
import com.ssafy.chaing.fintech.service.request.InquireBillingRequest;
import com.ssafy.chaing.fintech.service.request.InquireDemandDepositAccountRequest;
import com.ssafy.chaing.fintech.service.request.SimpleTransferRequest;
import com.ssafy.chaing.fintech.service.response.ClientErrorResponse;
import com.ssafy.chaing.fintech.service.response.FintechBaseResponse;
import com.ssafy.chaing.fintech.util.ClientErrorParser;
import com.ssafy.chaing.fintech.util.HeaderUtil;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.domain.GroupUserEntity;
import com.ssafy.chaing.group.repository.GroupRepository;
import com.ssafy.chaing.group.repository.GroupUserRepository;
import com.ssafy.chaing.notification.domain.NotificationCategory;
import com.ssafy.chaing.notification.service.NotificationService;
import com.ssafy.chaing.payment.domain.FeeType;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class FintechServiceImpl implements FintechService {

    private final SsafyApiConfig config;
    private final RestTemplate restTemplate;
    private final HeaderUtil headerUtil;
    private final RentHandler rentHandler;
    private final NotificationService notificationService;
    private final GroupUserRepository groupUserRepository;
    private final ContractRepository contractRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final UtilityHandler utilityHandler;

    public FintechServiceImpl(
            RestTemplateBuilder builder,
            HeaderUtil headerUtil,
            SsafyApiConfig ssafyApiConfig,
            RentHandler rentHandler,
            NotificationService notificationService,
            GroupUserRepository groupUserRepository,
            ContractRepository contractRepository,
            GroupRepository groupRepository,
            UserRepository userRepository,
            UtilityHandler utilityHandler) {
        this.restTemplate = builder.build();
        this.headerUtil = headerUtil;
        this.config = ssafyApiConfig;
        this.rentHandler = rentHandler;
        this.notificationService = notificationService;
        this.groupUserRepository = groupUserRepository;
        this.contractRepository = contractRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.utilityHandler = utilityHandler;
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
    public TransferDTO manualTransfer(ManualTransferCommand command, Long userId) {
        UserEntity user = getUserEntity(userId);
        GroupEntity group = getGroupEntity(user);
        ContractEntity contract = getContractEntity(group);

        return new TransferDTO(false);
    }

    @Override
    public TransferDTO rentTransfer(TransferCommand command) {
        try {
            if (command.getAmount() <= 0) {
                log.info("송금할 금액이 없습니다. Transaction Balance : {}", command.getAmount());
                return new TransferDTO(true);
            }
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
            command.setStatus(true);

            log.info("▶️▶️▶️Smart Contract[Rent] 비동기 호출 시작");
            RentInput input = RentInput.from(command);
            CompletableFuture<Boolean> future = rentHandler.addContract(input);

            future.thenAccept(success -> {
                // 이 코드는 비동기 작업이 완료된 후 실행됩니다 (별도의 스레드에서)
                if (success) {
                    log.info("✨ 스마트 컨트랙트 등록 성공! 🚀");

                    if (command.getFeeType() == FeeType.RENT) {
                        if (command.getUserId() == null) {
                            sendRentNotificationToGroup(
                                    command.getGroupId(),
                                    "월세 납부 완료!",
                                    "최종적으로 집주인께 월세 납부를 마쳤어요!"
                            );
                        }

                        if (command.getGroupId() == null) {
                            sendRentNotificationToUser(
                                    command.getUserId(),
                                    "월세 이체 완료!",
                                    "이번 달 납부하실 월세를 공동 계좌로 보냈어요!"
                            );
                        }
                    } else {
                        sendUtilityNotificationToUser(
                                command.getUserId(),
                                "공과금 이체 완료!",
                                "이번 주 납부하실 카드 대납급을 공동 계좌로 보냈어요!"
                        );
                    }
                } else {
                    log.error("❗ 스마트 컨트랙트 등록 실패 ❗");

                    if (command.getFeeType() == FeeType.RENT) {
                        if (command.getUserId() == null) {
                            sendRentNotificationToGroup(
                                    command.getGroupId(),
                                    "월세 납부 실패",
                                    "집주인께 보내는 월세 내역 트랜잭션 등록 중 문제가 발생했어요."
                            );
                        }

                        if (command.getGroupId() == null) {
                            sendRentNotificationToUser(
                                    command.getUserId(),
                                    "월세 이체 실패",
                                    "납부하실 월세 내역 트랜잭션 등록 중 문제가 발생했어요."
                            );
                        }
                    } else {
                        sendUtilityNotificationToUser(
                                command.getUserId(),
                                "공과금 이체 실패",
                                "납부하실 카드 내역 트랜잭션 등록 중 문제가 발생했어요."
                        );
                    }
                }
            }).exceptionally(ex -> {
                log.error("❗ 스마트 컨트랙트 등록 실패 ❗");

                if (command.getFeeType() == FeeType.RENT) {
                    if (command.getUserId() == null) {
                        sendRentNotificationToGroup(
                                command.getGroupId(),
                                "월세 납부 실패",
                                "집주인께 보내는 월세 내역 트랜잭션 등록 중 문제가 발생했어요."
                        );
                    }

                    if (command.getGroupId() == null) {
                        sendRentNotificationToUser(
                                command.getUserId(),
                                "월세 이체 실패",
                                "납부하실 월세 내역 트랜잭션 등록 중 문제가 발생했어요."
                        );
                    }
                } else {
                    sendUtilityNotificationToUser(
                            command.getUserId(),
                            "공과금 이체 실패",
                            "납부하실 카드 내역 트랜잭션 등록 중 문제가 발생했어요."
                    );
                }
                return null;
            });
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
    public TransferDTO utilityTransfer(TransferCommand command) {
        try {
            if (command.getAmount() <= 0) {
                log.info("송금할 금액이 없습니다. Transaction Balance : {}", command.getAmount());
                return new TransferDTO(true);
            }
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
            command.setStatus(true);

            log.info("▶️▶️▶️Smart Contract[Rent] 비동기 호출 시작");
            UtilityInput input = UtilityInput.from(command);
            CompletableFuture<Boolean> future = utilityHandler.addContract(input);

            future.thenAccept(success -> {
                // 이 코드는 비동기 작업이 완료된 후 실행됩니다 (별도의 스레드에서)
                if (success) {
                    log.info("✨ 스마트 컨트랙트 등록 성공! 🚀");

                    if (command.getFeeType() == FeeType.RENT) {
                        if (command.getUserId() == null) {
                            sendRentNotificationToGroup(
                                    command.getGroupId(),
                                    "월세 납부 완료!",
                                    "최종적으로 집주인께 월세 납부를 마쳤어요!"
                            );
                        }

                        if (command.getGroupId() == null) {
                            sendRentNotificationToUser(
                                    command.getUserId(),
                                    "월세 이체 완료!",
                                    "이번 달 납부하실 월세를 공동 계좌로 보냈어요!"
                            );
                        }
                    } else {
                        sendUtilityNotificationToUser(
                                command.getUserId(),
                                "공과금 이체 완료!",
                                "이번 주 납부하실 카드 대납급을 공동 계좌로 보냈어요!"
                        );
                    }
                } else {
                    log.error("❗ 스마트 컨트랙트 등록 실패 ❗");

                    if (command.getFeeType() == FeeType.RENT) {
                        if (command.getUserId() == null) {
                            sendRentNotificationToGroup(
                                    command.getGroupId(),
                                    "월세 납부 실패",
                                    "집주인께 보내는 월세 내역 트랜잭션 등록 중 문제가 발생했어요."
                            );
                        }

                        if (command.getGroupId() == null) {
                            sendRentNotificationToUser(
                                    command.getUserId(),
                                    "월세 이체 실패",
                                    "납부하실 월세 내역 트랜잭션 등록 중 문제가 발생했어요."
                            );
                        }
                    } else {
                        sendUtilityNotificationToUser(
                                command.getUserId(),
                                "공과금 이체 실패",
                                "납부하실 카드 내역 트랜잭션 등록 중 문제가 발생했어요."
                        );
                    }
                }
            }).exceptionally(ex -> {
                log.error("❗ 스마트 컨트랙트 등록 실패 ❗");

                if (command.getFeeType() == FeeType.RENT) {
                    if (command.getUserId() == null) {
                        sendRentNotificationToGroup(
                                command.getGroupId(),
                                "월세 납부 실패",
                                "집주인께 보내는 월세 내역 트랜잭션 등록 중 문제가 발생했어요."
                        );
                    }

                    if (command.getGroupId() == null) {
                        sendRentNotificationToUser(
                                command.getUserId(),
                                "월세 이체 실패",
                                "납부하실 월세 내역 트랜잭션 등록 중 문제가 발생했어요."
                        );
                    }
                } else {
                    sendUtilityNotificationToUser(
                            command.getUserId(),
                            "공과금 이체 실패",
                            "납부하실 카드 내역 트랜잭션 등록 중 문제가 발생했어요."
                    );
                }
                return null;
            });
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
        try {
            HeaderWithUserKeyDTO requestHeader = headerUtil.createFintechHeaderWithUserKey(
                    "inquireBillingStatements", "inquireBillingStatements"
            );

            InquireBillingRequest request = new InquireBillingRequest(requestHeader, command);

            ResponseEntity<FintechBaseResponse<List<InquireBillingStatementsRec>>> responseEntity =
                    restTemplate.exchange(
                            config.getBaseUrl() + "/creditCard/inquireBillingStatements",
                            HttpMethod.POST,
                            new HttpEntity<>(request),
                            new ParameterizedTypeReference<>() {
                            }
                    );

            return Objects.requireNonNull(responseEntity.getBody()).rec();
        } catch (HttpClientErrorException e) {
            log.error("청구서 조회 실패 - 상태 코드: {}, 응답 내용: {}", e.getStatusCode(), e.getResponseBodyAsString());

            // 🔥 에러 응답 파싱 및 처리
            ClientErrorResponse errorResponse = ClientErrorParser.parseErrorResponse(e.getResponseBodyAsString());
            return new ArrayList<>();

        } catch (Exception e) {
            log.error("청구서 조회 중 알 수 없는 오류 발생: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public FintechResponse<?> inquireDemandDepositAccount(String accountNo) {
        ClientErrorResponse errorResponse = null;
        try {
            HeaderWithUserKeyDTO requestHeader = headerUtil.createFintechHeaderWithUserKey(
                    "inquireDemandDepositAccount", "inquireDemandDepositAccount"
            );

            InquireDemandDepositAccountRequest request = new InquireDemandDepositAccountRequest(requestHeader,
                    accountNo);

            ResponseEntity<FintechBaseResponse<InquireDemandDepositAccountRec>> responseEntity =
                    restTemplate.exchange(
                            config.getBaseUrl() + "/demandDeposit/inquireDemandDepositAccount",
                            HttpMethod.POST,
                            new HttpEntity<>(request),
                            new ParameterizedTypeReference<>() {
                            }
                    );

            InquireDemandDepositAccountRec rec = Objects.requireNonNull(responseEntity.getBody()).rec();
            return new FintechResponse<>(rec);
        } catch (HttpClientErrorException e) {
            log.error("청구서 조회 실패 - 상태 코드: {}, 응답 내용: {}", e.getStatusCode(), e.getResponseBodyAsString());

            // 🔥 에러 응답 파싱 및 처리
            errorResponse = ClientErrorParser.parseErrorResponse(e.getResponseBodyAsString());
            return new FintechResponse<>(errorResponse);

        } catch (Exception e) {
            log.error("청구서 조회 중 알 수 없는 오류 발생: {}", e.getMessage());
            return new FintechResponse<>(errorResponse);
        }
    }

    @Override
    public FintechResponse<?> createAccount() {
        ClientErrorResponse errorResponse = null;
        try {
            HeaderWithUserKeyDTO requestHeader = headerUtil.createFintechHeaderWithUserKey(
                    "createDemandDepositAccount", "createDemandDepositAccount"
            );

            CreateAccountRequest request = new CreateAccountRequest(requestHeader);

            ResponseEntity<FintechBaseResponse<CreateAccountRec>> responseEntity =
                    restTemplate.exchange(
                            config.getBaseUrl() + "/demandDeposit/createDemandDepositAccount",
                            HttpMethod.POST,
                            new HttpEntity<>(request),
                            new ParameterizedTypeReference<>() {
                            }
                    );

            CreateAccountRec rec = Objects.requireNonNull(responseEntity.getBody()).rec();
            return new FintechResponse<>(rec);
        } catch (HttpClientErrorException e) {
            log.error("청구서 조회 실패 - 상태 코드: {}, 응답 내용: {}", e.getStatusCode(), e.getResponseBodyAsString());

            // 🔥 에러 응답 파싱 및 처리
            errorResponse = ClientErrorParser.parseErrorResponse(e.getResponseBodyAsString());
            return new FintechResponse<>(errorResponse);

        } catch (Exception e) {
            log.error("청구서 조회 중 알 수 없는 오류 발생: {}", e.getMessage());
            return new FintechResponse<>(errorResponse);
        }
    }

    @Transactional
    @Override
    public FintechResponse<?> getAccountHistory(AccountHistoryCommand command) {
        ClientErrorResponse errorResponse = null;
        try {
            HeaderWithUserKeyDTO requestHeader = headerUtil.createFintechHeaderWithUserKey(
                    "inquireTransactionHistoryList", "inquireTransactionHistoryList"
            );

            AccountHistoryRequest request = new AccountHistoryRequest(requestHeader, command);

            ResponseEntity<FintechBaseResponse<InquireTransactionHistoryRec>> responseEntity =
                    restTemplate.exchange(
                            config.getBaseUrl() + "/demandDeposit/inquireTransactionHistoryList",
                            HttpMethod.POST,
                            new HttpEntity<>(request),
                            new ParameterizedTypeReference<>() {
                            }
                    );

            InquireTransactionHistoryRec rec = Objects.requireNonNull(responseEntity.getBody()).rec();
            return new FintechResponse<>(rec);
        } catch (HttpClientErrorException e) {
            log.error("계좌 거래 내역 조회 실패 - 상태 코드: {}, 응답 내용: {}", e.getStatusCode(), e.getResponseBodyAsString());

            errorResponse = ClientErrorParser.parseErrorResponse(e.getResponseBodyAsString());
            return new FintechResponse<>(errorResponse);

        } catch (Exception e) {
            log.error("계좌 거래 내역 조회 중 알 수 없는 오류 발생: {}", e.getMessage());
            return new FintechResponse<>(errorResponse);
        }
    }

    @Override
    @Transactional
    public FintechResponse<?> transferWithSimple(SimpleTransferCommand command) {
        ClientErrorResponse errorResponse = null;
        try {
            HeaderWithUserKeyDTO requestHeader = headerUtil.createFintechHeaderWithUserKey(
                    "updateDemandDepositAccountTransfer", "updateDemandDepositAccountTransfer"
            );

            SimpleTransferRequest request = new SimpleTransferRequest(requestHeader, command);

            ResponseEntity<FintechBaseResponse<List<SimpleTransferRec>>> responseEntity =
                    restTemplate.exchange(
                            config.getBaseUrl() + "/demandDeposit/updateDemandDepositAccountTransfer",
                            HttpMethod.POST,
                            new HttpEntity<>(request),
                            new ParameterizedTypeReference<>() {
                            }
                    );

            List<SimpleTransferRec> rec = Objects.requireNonNull(responseEntity.getBody()).rec();
            return new FintechResponse<>(rec);
        } catch (HttpClientErrorException e) {
            log.error("단순 계좌 이체 실패 - 상태 코드: {}, 응답 내용: {}", e.getStatusCode(), e.getResponseBodyAsString());

            errorResponse = ClientErrorParser.parseErrorResponse(e.getResponseBodyAsString());
            return new FintechResponse<>(errorResponse);
        } catch (Exception e) {
            log.error("단순 계좌 이체 중 알 수 없는 오류 발생: {}", e.getMessage());
            return new FintechResponse<>(errorResponse);
        }
    }

    private void sendRentNotificationToGroup(Long groupId, String title, String content) {
        List<GroupUserEntity> members = groupUserRepository.findByGroupId(groupId);
        members.forEach(member -> {
            notificationService.sendNotification(
                    member.getUser().getId(),
                    title,
                    content,
                    NotificationCategory.RENT
            );
        });
    }

    private void sendRentNotificationToUser(Long userId, String title, String content) {
        notificationService.sendNotification(
                userId,
                title,
                content,
                NotificationCategory.RENT
        );
    }

    private void sendUtilityNotificationToUser(Long userId, String title, String content) {
        notificationService.sendNotification(
                userId,
                title,
                content,
                NotificationCategory.UTILITY
        );
    }

    private UserEntity getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.USER_NOT_FOUND));
    }

    private GroupEntity getGroupEntity(UserEntity user) {
        return groupRepository.findById(user.getGroupId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.GROUP_NOT_FOUND));
    }

    private ContractEntity getContractEntity(GroupEntity group) {
        return contractRepository.findById(group.getContractId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.CONTRACT_NOT_FOUND));
    }
}

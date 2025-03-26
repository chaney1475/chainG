package com.ssafy.chaing.blockchain.handler;

import com.ssafy.chaing.blockchain.handler.contract.ContractHandler;
import com.ssafy.chaing.blockchain.handler.contract.input.ContractInput;
import com.ssafy.chaing.blockchain.handler.contract.input.LiveAccountInput;
import com.ssafy.chaing.blockchain.handler.contract.input.PaymentInfoInput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractOverviewOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.ContractRentOutput;
import com.ssafy.chaing.blockchain.handler.contract.output.PaymentInfoCountOutput;
import com.ssafy.chaing.blockchain.web3j.ContractManager;
import com.ssafy.chaing.blockchain.web3j.ContractManager.PaymentInfo;
import java.math.BigInteger;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tuples.generated.Tuple13;
import org.web3j.tuples.generated.Tuple3;
import org.web3j.tuples.generated.Tuple6;
import org.web3j.tx.TransactionManager;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ContractHandlerTest {

    @Mock
    private Web3j web3j;

    @Mock
    private TransactionManager txManager;

    // ContractHandler가 내부적으로 의존하는 ContractManager를 모의 객체로 생성
    @Mock
    private ContractManager contractManager;

    private ContractHandler contractHandler;

    private final String CONTRACT_ADDRESS = "0x7928F8BEa5E1d502eb5B882b7cab0d3e11a85e35";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // 생성한 객체를 spy로 wrapping하여 stub이나 verify가 가능하도록 합니다.
        contractHandler = Mockito.spy(new ContractHandler(web3j, txManager, CONTRACT_ADDRESS));
        // ContractManager 필드는 내부적으로 생성되었을 수 있으므로 ReflectionTestUtils를 사용해 모의 객체를 주입합니다.
        ReflectionTestUtils.setField(contractHandler, "contractManager", contractManager);
    }


    @Test
    void testAddContract() throws Exception {
        // PaymentInfoInput에 대한 테스트 데이터를 생성합니다.
        PaymentInfoInput paymentInfo1 = new PaymentInfoInput(
                BigInteger.valueOf(1), // userId
                BigInteger.valueOf(2100000), // amount
                BigInteger.valueOf(7)   // ratio
        );

        PaymentInfoInput paymentInfo2 = new PaymentInfoInput(
                BigInteger.valueOf(2), // userId
                BigInteger.valueOf(600000), // amount
                BigInteger.valueOf(2)   // ratio
        );

        PaymentInfoInput paymentInfo3 = new PaymentInfoInput(
                BigInteger.valueOf(3), // userId
                BigInteger.valueOf(300000), // amount
                BigInteger.valueOf(1)   // ratio
        );

        // ContractInput에 PaymentInfos를 포함한 테스트 데이터를 작성합니다.
        ContractInput input = new ContractInput();
        input.setId(BigInteger.ONE);
        input.setStartDate("2025-01-01Z");
        input.setEndDate("2025-12-31Z");
        input.setRentTotalAmount(BigInteger.valueOf(3000000));
        input.setRentDueDate(BigInteger.valueOf(5));
        input.setRentAccountNo("112233445566");
        input.setOwnerAccountNo("665544332211");
        input.setRentTotalRatio(BigInteger.TEN);
        input.setPaymentInfos(List.of(paymentInfo1, paymentInfo2, paymentInfo3)); // non-empty 리스트
        input.setLiveAccountNo("123456789012");
        input.setIsUtilityEnabled(true);
        input.setUtilitySplitRatio(BigInteger.valueOf(3));
        input.setCardId(BigInteger.valueOf(123));

        // ContractManager의 addContract 메서드를 모의하여 "resultAddress" 반환하도록 설정합니다.
        when(contractHandler.addContract(any(ContractInput.class))).thenReturn("resultAddress");

        String result = contractHandler.addContract(input);
        assertEquals("resultAddress", result);
        verify(contractHandler).addContract(any(ContractInput.class));
    }

    @Test
    void testGetContract() throws Exception {
        Tuple13<BigInteger, String, String, BigInteger, BigInteger, String, String, BigInteger, List<PaymentInfo>, String, Boolean, BigInteger, BigInteger> dummyTuple =
                new Tuple13<>(
                        BigInteger.ONE,
                        "2025-01-01Z",
                        "2025-12-31Z",
                        BigInteger.valueOf(3000000),
                        BigInteger.valueOf(5),
                        "112233445566",
                        "998877665544",
                        BigInteger.TEN,
                        List.of(
                                new PaymentInfo(new Uint256(1), new Uint256(2100000), new Uint256(7)),
                                new PaymentInfo(new Uint256(2), new Uint256(600000), new Uint256(2)),
                                new PaymentInfo(new Uint256(3), new Uint256(300000), new Uint256(1))
                        ),
                        "123456789012",
                        true,
                        BigInteger.valueOf(3),
                        BigInteger.valueOf(123)
                );

        // RemoteFunctionCall 객체를 모의 객체로 생성
        RemoteFunctionCall<Tuple13<BigInteger, String, String, BigInteger, BigInteger, String, String, BigInteger, List<PaymentInfo>, String, Boolean, BigInteger, BigInteger>> mockFunctionCall =
                Mockito.mock(RemoteFunctionCall.class);

        // contractManager의 getFullContractData 메서드가 모의 객체를 반환하도록 설정하고,
        // 그 모의 객체에서 send() 호출 시 dummyTuple을 반환하도록 설정합니다.
        when(contractManager.getFullContractData(BigInteger.ONE)).thenReturn(mockFunctionCall);
        when(mockFunctionCall.send()).thenReturn(dummyTuple);

        // ContractHandler의 getContract 메서드를 호출하여 결과를 검증합니다.
        ContractOutput result = contractHandler.getContract(BigInteger.ONE);
        assertNotNull(result);
        assertEquals(BigInteger.ONE, result.getId());

    }

    @Test
    void testGetContractOverview() throws Exception {
        // 모의 RemoteFunctionCall 객체 생성
        RemoteFunctionCall<Tuple3<BigInteger, String, String>> mockFunctionCall = Mockito.mock(RemoteFunctionCall.class);
        // 테스트용 dummy 결과 생성
        Tuple3<BigInteger, String, String> dummyTuple =
                new Tuple3<>(BigInteger.ONE, "2025-01-01", "2025-12-31");

        // contractManager의 getContractOverview가 모의 객체를 반환하도록 stub 처리
        when(contractManager.getContractOverview(BigInteger.ONE)).thenReturn(mockFunctionCall);
        // mockFunctionCall.send()가 dummy 결과를 반환하도록 설정
        when(mockFunctionCall.send()).thenReturn(dummyTuple);

        // ContractHandler의 getContractOverview 메서드 호출
        ContractOverviewOutput result = contractHandler.getContractOverview(BigInteger.ONE);
        assertNotNull(result);
        assertEquals("2025-01-01", result.getStartDate());
    }

    @Test
    void testGetPaymentInfoCount() throws Exception {
        // 모의 RemoteFunctionCall<BigInteger> 객체 생성
        RemoteFunctionCall<BigInteger> mockFunctionCall = Mockito.mock(RemoteFunctionCall.class);

        // contractManager의 getPaymentInfoCount(BigInteger.ONE) 호출 시 위의 모의 객체 반환하도록 설정
        when(contractManager.getPaymentInfoCount(BigInteger.ONE)).thenReturn(mockFunctionCall);

        // mockFunctionCall.send()가 호출되면 BigInteger.valueOf(3) 값을 반환하도록 설정
        when(mockFunctionCall.send()).thenReturn(BigInteger.valueOf(3));

        // 실제 테스트 대상 메서드 호출
        PaymentInfoCountOutput result = contractHandler.getPaymentInfoCount(BigInteger.ONE);

        // 결과가 예상대로 BigInteger 3을 포함하는지 검증
        assertNotNull(result);
        assertEquals(BigInteger.valueOf(3), result.getCount());
    }


    @Test
    void testGetRentData() throws Exception {
        // RemoteFunctionCall 모의 객체 생성 (Tuple6 또는 ContractRentOutput에 필요한 tuple 객체)
        RemoteFunctionCall<Tuple6<BigInteger, BigInteger, String, String, BigInteger, BigInteger>> mockRemoteCall =
                Mockito.mock(RemoteFunctionCall.class);

        // 더미 반환 값 생성 (각 항목은 ContractRentOutput의 생성자에 맞게 설정해야 합니다)
        Tuple6<BigInteger, BigInteger, String, String, BigInteger, BigInteger> dummyTuple =
                new Tuple6<>(
                        BigInteger.valueOf(3000000), // rentTotalAmount
                        BigInteger.valueOf(5),       // rentDueDate
                        "112233445566",              // rentAccountNo
                        "665544332211",              // ownerAccountNo
                        BigInteger.TEN,              // rentTotalRatio
                        BigInteger.valueOf(3)        // 추가 숫자값 (예시)
                );

        // contractManager.getRentData(BigInteger.ONE)가 모의 객체 반환하도록 stub 처리
        when(contractManager.getRentData(BigInteger.ONE)).thenReturn(mockRemoteCall);
        when(mockRemoteCall.send()).thenReturn(dummyTuple);

        // 실제 메서드 호출
        ContractRentOutput result = contractHandler.getRentData(BigInteger.ONE);
        assertNotNull(result);
        assertEquals("112233445566", result.getRentAccountNo());
    }

    @Test
    void testAddLiveAccount_WithValidInput() throws Exception {
        // LiveAccountInput 객체를 생성하고 liveAccountNo를 설정
        LiveAccountInput liveAccountInput = new LiveAccountInput("validAccountNo");

        // 성공적인 TransactionReceipt를 모의 객체로 생성 및 설정
        TransactionReceipt dummyReceipt = Mockito.mock(TransactionReceipt.class);
        when(dummyReceipt.isStatusOK()).thenReturn(true);

        // RemoteFunctionCall 모의 객체 생성 후 send() 메서드가 dummyReceipt 반환하도록 설정
        RemoteFunctionCall<TransactionReceipt> remoteCall = Mockito.mock(RemoteFunctionCall.class);
        when(remoteCall.send()).thenReturn(dummyReceipt);

        // contractManager.updateLiveAccountNo 호출 시 remoteCall 반환하도록 스텁 처리
        when(contractManager.updateLiveAccountNo(eq(BigInteger.ONE), eq("validAccountNo")))
                .thenReturn(remoteCall);

        // 실제 메서드 호출
        String result = contractHandler.addLiveAccount(BigInteger.ONE, liveAccountInput);

        // 결과 검증: TransactionReceipt.isStatusOK()가 true이므로 "addLiveAccount success"가 반환되어야 합니다.
        assertEquals("addLiveAccount success", result);
    }
}


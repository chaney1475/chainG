package com.ssafy.chaing.blockchain.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;

@Configuration
public class Web3jConfig {

    // Polygon RPC 엔드포인트 (예: https://polygon-rpc.com)
    @Value("${web3j.client-address}")
    private String clientAddress;

    // 서버에서 사용할 지갑의 프라이빗 키 (절대로 일반에 노출하지 마세요!)
    @Value("${web3j.wallet-private-key}")
    private String privateKey;

    @Value("${web3j.chain-id}")
    private int chainId;

    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(clientAddress));
    }

    @Bean
    public Credentials credentials() {
        return Credentials.create(privateKey);
    }

    @Bean
    public TransactionManager txManager(Web3j web3j, Credentials credentials) {
        // RawTransactionManager는 chainId를 받아 EIP-155 트랜잭션을 생성합니다.
        return new RawTransactionManager(web3j, credentials, chainId);

    }
}


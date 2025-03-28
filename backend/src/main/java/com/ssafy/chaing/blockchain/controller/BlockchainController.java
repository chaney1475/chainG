package com.ssafy.chaing.blockchain.controller;

import com.ssafy.chaing.blockchain.service.BlockchainService;
import java.math.BigInteger;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/blockchain")
@RequiredArgsConstructor
public class BlockchainController {

    private final BlockchainService blockchainService;

    @PostMapping("/contract/{contractId}/pdf")
    public ResponseEntity<?> insertTestContract(
            @PathVariable("contractId") BigInteger contractId
    ) {
        return ResponseEntity.ok(null);
    }
}

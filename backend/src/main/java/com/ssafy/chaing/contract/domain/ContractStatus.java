package com.ssafy.chaing.contract.domain;

public enum ContractStatus {
    PENDING, CONFIRMED, REVIEW_REQUIRED,
}

// A: PENDING -> CONFIRM -> REVIEW_REQUIRED -> CONFIRMED
// B: PENDING -> (수정) -> CONFIRMED
// C: PENDING -> CONFIRM

// A,B,C -> completed -> true, contract -> CONFIRMED

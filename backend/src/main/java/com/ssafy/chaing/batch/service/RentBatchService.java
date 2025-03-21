package com.ssafy.chaing.batch.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RentBatchService {

    // ContractRepository에서 dueDate가 Today + 1인 Contract 조회
    // ContractEntity를 가지고 ContractUserEntity 가져오기
    // SSAFY 이체 API를 써서 이체 성공하면 컨트랙트로 올리기 + 성공 알림
    // 실패하면 실패한 내용 만들어서 올리기 + 실패 알림
    // 모두 이체가 끝나면 납부 여부에 따라서 Contract Status 값 설정.



    // 오늘이 납부일인 ContraectEntity 조회
    // status가 true라면 owner 계좌로 이체
    // false 라면 알림 요청
}

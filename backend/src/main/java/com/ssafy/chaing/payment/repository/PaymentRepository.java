package com.ssafy.chaing.payment.repository;

import com.ssafy.chaing.payment.domain.FeeType;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.domain.PaymentStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    List<PaymentEntity> findByStatusIn(List<PaymentStatus> started);

    List<PaymentEntity> findByStatus(PaymentStatus paymentStatus);

    List<PaymentEntity> findALlByContractIdAndFeeType(Long contract_id, FeeType feeType);
}

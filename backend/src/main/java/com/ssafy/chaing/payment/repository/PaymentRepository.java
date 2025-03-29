package com.ssafy.chaing.payment.repository;

import com.ssafy.chaing.payment.domain.FeeType;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.domain.PaymentStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    List<PaymentEntity> findByStatusIn(List<PaymentStatus> started);

    List<PaymentEntity> findByStatus(PaymentStatus paymentStatus);


    List<PaymentEntity> findAllByContractIdAndFeeType(Long contractId, FeeType feeType);

    List<PaymentEntity> findAllByContractIdAndFeeTypeAndMonthOrderByWeekDesc(Long contractId, FeeType feeType, int month);

}

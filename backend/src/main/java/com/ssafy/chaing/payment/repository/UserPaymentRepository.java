package com.ssafy.chaing.payment.repository;

import com.ssafy.chaing.payment.domain.UserPaymentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPaymentRepository extends JpaRepository<UserPaymentEntity, Long> {

    List<UserPaymentEntity> findAllByPaymentIdIn(List<Long> paymentIds);

}

package com.ssafy.chaing.payment.repository;

import com.ssafy.chaing.payment.domain.UserPaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPaymentRepository extends JpaRepository<UserPaymentEntity, Long> {
}

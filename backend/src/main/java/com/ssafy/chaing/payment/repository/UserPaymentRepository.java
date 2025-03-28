package com.ssafy.chaing.payment.repository;

import com.ssafy.chaing.payment.domain.UserPaymentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserPaymentRepository extends JpaRepository<UserPaymentEntity, Long> {

    List<UserPaymentEntity> findAllByPaymentIdIn(List<Long> paymentIds);

    @Query("""
            select up from UserPaymentEntity up
            join fetch up.contractMember cm
            join fetch cm.user where up.payment.id = :paymentId
            """)
    List<UserPaymentEntity> findWithMemberAndUserByPaymentId(Long paymentId);


}

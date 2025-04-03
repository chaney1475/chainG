package com.ssafy.chaing.payment.repository;

import com.ssafy.chaing.contract.domain.ContractStatus;
import com.ssafy.chaing.payment.domain.FeeType;
import com.ssafy.chaing.payment.domain.PaymentEntity;
import com.ssafy.chaing.payment.domain.PaymentStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    List<PaymentEntity> findByStatusIn(List<PaymentStatus> started);

    List<PaymentEntity> findByStatus(PaymentStatus paymentStatus);

    @Query("""
            SELECT p FROM PaymentEntity p
                        JOIN FETCH p.contract c
                        JOIN FETCH c.members
                        WHERE p.id = :id
            """)
    Optional<PaymentEntity> findWithContractAndMembersById(Long id);

    List<PaymentEntity> findAllByContractIdAndFeeType(Long contractId, FeeType feeType);

    List<PaymentEntity> findAllByContractIdAndFeeTypeAndMonthOrderByWeekDesc(Long contractId, FeeType feeType,
                                                                             int month);

    @Query("SELECT p.retryCount FROM PaymentEntity p WHERE p.id = :id")
    int findRetryCount(Long id);

    Optional<PaymentEntity> findByMonth(int month);

    @Query("""
            SELECT p FROM PaymentEntity p
            JOIN FETCH p.contract c
            WHERE c.status = :status
            """)
    List<PaymentEntity> findAllPaymentsForConfirmedContracts(@Param("status") ContractStatus status);

    Optional<PaymentEntity> findWithUsersByContractIdAndMonthAndFeeType(Long contractId, int month, FeeType feeType);

    Optional<PaymentEntity> findTopByContractIdAndFeeTypeOrderByMonthDescWeekDesc(Long id, FeeType feeType);
}

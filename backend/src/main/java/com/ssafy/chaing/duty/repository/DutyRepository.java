package com.ssafy.chaing.duty.repository;

import com.ssafy.chaing.duty.domain.DutyEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DutyRepository extends JpaRepository<DutyEntity, Long> {
    List<DutyEntity> findByGroup_Id(Long groupId);
}

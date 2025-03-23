package com.ssafy.chaing.duty.service;

import com.ssafy.chaing.duty.controller.request.DutyFormRequest;
import com.ssafy.chaing.duty.repository.DutyRepository;
import com.ssafy.chaing.duty.service.dto.DutyFormDTO;
import com.ssafy.chaing.duty.service.dto.DutyListDTO;
import com.ssafy.chaing.duty.service.dto.RemovedDutyDTO;
import com.ssafy.chaing.group.domain.GroupEntity;
import com.ssafy.chaing.group.repository.GroupRepository;
import com.ssafy.chaing.group.repository.GroupUserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DutyServiceImpl implements DutyService {

    private final DutyRepository dutyRepository;
    private final GroupRepository groupRepository;
    private final GroupUserRepository groupUserRepository;


    @Override
    public DutyListDTO getDuties(Long groupId) {
        return null;
    }

    @Override
    public DutyFormDTO creatDuty(Long groupId, DutyFormRequest request) {
        return null;
    }

    @Override
    public DutyFormDTO updateDuty(Long dutyId, DutyFormRequest request) {
        return null;
    }

    @Override
    public RemovedDutyDTO removeDuty(Long dutyId) {
        return null;
    }
}

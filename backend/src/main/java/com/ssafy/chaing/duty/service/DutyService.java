package com.ssafy.chaing.duty.service;

import com.ssafy.chaing.duty.controller.request.DutyFormRequest;
import com.ssafy.chaing.duty.service.dto.DutyFormDTO;
import com.ssafy.chaing.duty.service.dto.DutyListDTO;
import com.ssafy.chaing.duty.service.dto.RemovedDutyDTO;

public interface DutyService {
    DutyListDTO getDuties(Long groupId);

    DutyFormDTO creatDuty(Long groupId, DutyFormRequest request);

    DutyFormDTO updateDuty(Long dutyId, DutyFormRequest request);

    RemovedDutyDTO removeDuty(Long dutyId);

}

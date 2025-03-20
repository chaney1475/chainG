package com.ssafy.chaing.contract.service;

import com.ssafy.chaing.contract.service.command.ContractCommand;
import com.ssafy.chaing.contract.service.dto.ContractDTO;
import com.ssafy.chaing.contract.service.dto.ContractDetailDTO;

public interface ContractService {
    ContractDetailDTO getContract(Long contractId);

    ContractDTO updateContract(Long contractId, ContractCommand command);

    ContractDTO createDraftContract(Long groupId, Long userId);
}

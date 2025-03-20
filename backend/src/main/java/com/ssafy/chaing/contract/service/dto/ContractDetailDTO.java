package com.ssafy.chaing.contract.service.dto;

import com.ssafy.chaing.contract.domain.ContractEntity;
import com.ssafy.chaing.contract.domain.ContractStatus;
import com.ssafy.chaing.contract.domain.ContractUserEntity;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class ContractDetailDTO {
    private Long id;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private Integer dueDate;
    private String ownerAccountNo;
    private List<ContractMemberDTO> members;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;


    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Setter
    @Builder
    public static class ContractMemberDTO {
        private Long id;
        private Long userId;
        private ContractStatus status;

        public static ContractMemberDTO from(ContractUserEntity obj) {
            return ContractMemberDTO.builder()
                    .id(obj.getId())
                    .userId(obj.getUser().getId())
                    .status(obj.getContractStatus())
                    .build();
        }
    }

    public static ContractDetailDTO from(ContractEntity contract) {
        return new ContractDetailDTO(
                contract.getId(),
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getDueDate(),
                contract.getOwnerAccountNo(),
                contract.getContractUsers().stream().map(ContractMemberDTO::from).toList(),
                contract.getCreatedAt().atZone(ZoneId.of("UTC")),
                contract.getUpdatedAt().atZone(ZoneId.of("UTC"))
        );
    }
}

package com.ssafy.chaing.contract.service;

import com.ssafy.chaing.contract.domain.UtilityCardEntity;
import com.ssafy.chaing.contract.repository.UtilityCardRepository;
import com.ssafy.chaing.contract.service.command.CreateCardCommand;
import com.ssafy.chaing.contract.service.dto.UtilityCardDTO;
import com.ssafy.chaing.fintech.dto.CreateFintechCardRec;
import com.ssafy.chaing.fintech.service.FintechService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final UtilityCardRepository utilityCardRepository;
    private final FintechService fintechService;

    @Override
    public UtilityCardDTO registerUtilityCard(CreateCardCommand command) {
        CreateFintechCardRec rec = fintechService.createFintechCard(command);

        UtilityCardEntity entity = UtilityCardEntity.builder()
                .cardNo(rec.cardNo())
                .cvc(rec.cvc())
                .build();

        entity = utilityCardRepository.save(entity);

        return new UtilityCardDTO(entity.getId());
    }
}

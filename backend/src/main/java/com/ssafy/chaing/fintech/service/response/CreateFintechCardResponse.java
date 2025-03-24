package com.ssafy.chaing.fintech.service.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.chaing.fintech.dto.CreateFintechCardRec;

public record CreateFintechCardResponse(
        @JsonProperty("REC")
        CreateFintechCardRec rec
) {
}

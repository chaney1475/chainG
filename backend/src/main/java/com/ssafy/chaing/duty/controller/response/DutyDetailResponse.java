package com.ssafy.chaing.duty.controller.response;

import java.time.ZonedDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DutyDetailResponse {
    private Long id;
    private String title;
    private String content;
    private ZonedDateTime dutyTime;
    private String dayOfWeek;
    private boolean useTime;
    private List<Long> assignees;
}

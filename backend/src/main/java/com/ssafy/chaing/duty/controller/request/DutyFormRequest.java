package com.ssafy.chaing.duty.controller.request;

import java.time.ZonedDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DutyFormRequest {
    private String title;
    private String content;
    private ZonedDateTime dutyTime;
    private String dayOfWeek;
    private boolean useTime;
    private List<Long> assignees;
}
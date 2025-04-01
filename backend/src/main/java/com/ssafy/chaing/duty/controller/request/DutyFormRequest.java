package com.ssafy.chaing.duty.controller.request;

import java.time.OffsetTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DutyFormRequest {
    private String title;
    private String category;
    private OffsetTime dutyTime;
    private String dayOfWeek;
    private boolean useTime;
    private List<Long> assignees;
}
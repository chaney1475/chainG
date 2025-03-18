package com.ssafy.chaing.group.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class GroupUserDTO {
    private Long id;
    private String name;
    private String nickname;
    private String profileImage;
}

package com.ssafy.chaing.user.service;

import com.ssafy.chaing.user.service.dto.UserDTO;
import com.ssafy.chaing.user.service.dto.UserInfoDTO;
import java.util.List;

public interface UserService {

//    List<UserDTO> getAllUsers();

    UserDTO getMe(Long userId);

//    UserDTO addUser(UserRequest body);
//
//    UserProfileDTO getMyProfile(Long userId);
//
//    UserProfileDTO updateMyProfile(UpdateUserProfileCommand command);
//
//    void deleteUser(Long userId);

}

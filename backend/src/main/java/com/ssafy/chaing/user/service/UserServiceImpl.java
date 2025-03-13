package com.ssafy.chaing.user.service;

import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.common.exception.NotFoundException;
import com.ssafy.chaing.user.repository.UserRepository;
import com.ssafy.chaing.user.service.dto.UserDTO;
import com.ssafy.chaing.user.service.dto.UserInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDTO getMe(Long userId) {
        return userRepository.findById(userId).map(UserDTO::fromEntity).orElseThrow(
                () -> new NotFoundException(ExceptionCode.USER_NOT_FOUND)
        );
    }
}

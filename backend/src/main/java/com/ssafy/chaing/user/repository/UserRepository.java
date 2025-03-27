package com.ssafy.chaing.user.repository;

import com.ssafy.chaing.user.domain.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmailAddress(String emailAddress);

}

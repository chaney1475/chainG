package com.ssafy.chaing.group.repository;

import com.ssafy.chaing.group.domain.GroupUserEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupUserRepository extends JpaRepository<GroupUserEntity, Long> {

    boolean existsByGroupIdAndUserId(Long groupId, Long userId);

    @Query("""
             SELECT gu
             FROM GroupUserEntity gu
             JOIN FETCH gu.user u
             JOIN FETCH gu.group g
             WHERE gu.group.id = :groupId
            """)
    List<GroupUserEntity> findByGroupId(@Param("groupId") Long groupId);

    @Query("SELECT COUNT(gu) FROM GroupUserEntity gu WHERE gu.group.id = :groupId")
    int countByGroupId(@Param("groupId")Long groupId);

    @Query("""
            SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END
            FROM GroupUserEntity u
            WHERE u.group.id = :groupId
            AND u.user.nickname = :nickname
            """)
    boolean existsByGroupIdAndUserNickname(@Param("groupId") Long groupId, @Param("nickname") String nickname);

    @Query("""
            SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END
            FROM GroupUserEntity u
            WHERE u.group.id = :groupId
            AND u.user.profileImage = :profileImage
            """)
    boolean existsByGroupIdAndUserProfileImage(@Param("groupId") Long groupId,
                                               @Param("profileImage") String profileImage);

}

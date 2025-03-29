package com.ssafy.chaing.common.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.common.exception.ServerException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class S3Util {

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    private final AmazonS3 amazonS3;

    /**
     * 파일을 S3에 업로드하고, 해당 파일의 URL을 반환합니다.
     * @param file MultipartFile 형식의 업로드 파일
     * @return S3에 저장된 파일의 URL
     */
    public String uploadFile(MultipartFile file, Long entityId) {
        String fileName = entityId.toString() + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();  // 고유한 파일 이름 생성
        try {
            amazonS3.putObject(
                    new PutObjectRequest(bucketName,
                            fileName,
                            file.getInputStream(),
                            null)
                    );
        } catch (IOException e) {
            throw new ServerException(ExceptionCode.S3_UPLOAD_FAILED);
        }
        return amazonS3.getUrl(bucketName, fileName).toString();
    }

    public void deleteFile(String fileName) {
        try {
            amazonS3.deleteObject(bucketName, fileName);
        } catch (Exception e) {
            throw new ServerException(ExceptionCode.S3_DELETE_FAILED);
        }
    }


}
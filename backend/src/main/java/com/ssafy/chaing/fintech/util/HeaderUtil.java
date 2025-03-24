package com.ssafy.chaing.fintech.util;

import com.ssafy.chaing.fintech.service.common.HeaderDTO;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class HeaderUtil {

    @Value("${ssafy.fintech.api-key}")
    private String apiKey;
    @Value("${ssafy.fintech.user-key}")
    private String userKey;

    public HeaderDTO createFintechCardHeader() {
        Date now = new Date();
        String transmissionDate = new SimpleDateFormat("yyyyMMdd").format(now);
        String transmissionTime = new SimpleDateFormat("HHmmss").format(now);

        String institutionTransactionUniqueNo = generateInstitutionCode(transmissionDate, transmissionTime);

        return new HeaderDTO(
                "createCreditCard",
                transmissionDate,
                transmissionTime,
                "00100",
                "001",
                "createCreditCard",
                institutionTransactionUniqueNo,
                apiKey,
                userKey
        );
    }

    private String generateInstitutionCode(String transmissionDate, String transmissionTime) {
        // 랜덤 6자리 숫자 생성
        Random random = new Random();
        String randomDigits = String.format("%06d", random.nextInt(1_000_000));

        return transmissionDate + transmissionTime + randomDigits;
    }
}

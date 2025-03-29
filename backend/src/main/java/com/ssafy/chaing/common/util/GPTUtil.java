package com.ssafy.chaing.common.util;

import com.ssafy.chaing.common.exception.ExceptionCode;
import com.ssafy.chaing.common.exception.ServerException;
import java.io.IOException;
import org.json.JSONArray;
import org.json.JSONObject;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GPTUtil {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiUrl;

    private final OkHttpClient client = new OkHttpClient();

    private static final String SYSTEM_MESSAGE = "다음 사용자 입력을 카테고리 중 하나로 분류하세요.";

    // 생활룰 분류용
    public String classifyLifeRuleContent(String content)  {
        return classifyContent(lifeRulePrompt(content));
    }

    // 당번 분류용
    public String classifyDutyContent(String content) {
        return classifyContent(dutyPrompt(content));
    }

    private String classifyContent(String prompt) {
        JSONObject requestBodyJson = new JSONObject()
                .put("model", model)
                .put("messages", new JSONArray()
                        .put(new JSONObject()
                                .put("role", "system")
                                .put("content", SYSTEM_MESSAGE))
                        .put(new JSONObject()
                                .put("role", "user")
                                .put("content", prompt))
                );

        RequestBody body = RequestBody.create(
                requestBodyJson.toString(),
                MediaType.get("application/json")
        );

        Request request = new Request.Builder()
                .url(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new ServerException(ExceptionCode.GPT_REQUEST_FAILED);
            }
            String responseBody = response.body().string();
            JSONObject responseJson = new JSONObject(responseBody);
            return responseJson
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content")
                    .trim();
        } catch (IOException e) {
            throw new ServerException(ExceptionCode.GPT_REQUEST_FAILED);
        }
    }

    // 생활룰 분류 프롬프트
    private String lifeRulePrompt(String content) {
        return "다음 내용을 아래 10개 카테고리 중 하나로 분류해 주세요.\n" +
                "[수면습관, 방온도, 청소, 생활용품, 타 사생출입, 음식 섭취, 기타 사항, 생활 규칙, 소음 관리, 반려동물 관리]\n\n" +
                "내용: \"" + content + "\"\n\n" +
                "카테고리만 정확히 응답해 영어로 주세요.";
    }

    // 당번 분류 프롬프트
    private String dutyPrompt(String content) {
        return "다음 내용을 아래 10개 카테고리 중 하나로 분류해 주세요.\n" +
                "[CLEANING, COOKING, SHOPPING, MAINTENANCE, GARBAGE, LAUNDRY, PET_CARE, PLANT_CARE, SETTLEMENT, OTHER]\n\n" +
                "내용: \"" + content + "\"\n\n" +
                "카테고리만 정확히 영어로 응답해주세요.";
    }
}

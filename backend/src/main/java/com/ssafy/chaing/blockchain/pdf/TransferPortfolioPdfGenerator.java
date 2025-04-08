package com.ssafy.chaing.blockchain.pdf;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.ssafy.chaing.blockchain.handler.rent.output.RentOutput;
import com.ssafy.chaing.blockchain.handler.utility.output.UtilityOutput;
import com.ssafy.chaing.blockchain.portfolio.output.TransferPortfolio;
import com.ssafy.chaing.blockchain.portfolio.output.TransferPortfolioResponse;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringEscapeUtils;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class TransferPortfolioPdfGenerator implements PDFGenerator<TransferPortfolioResponse> {


    @Override
    public byte[] generate(TransferPortfolioResponse data) {
        if (data == null || data.getTransferPortfolio() == null) {
            throw new BadRequestException(ExceptionCode.PDF_GENERATION_FAILED);
        }

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            String html = buildHtml(data);
            log.debug("Generated HTML:\n{}", html);
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFont(() -> getClass().getResourceAsStream("/font/Paperlogy-5Medium.ttf"), "Paperlogy5");
            builder.useFont(() -> getClass().getResourceAsStream("/font/Paperlogy-7Bold.ttf"), "Paperlogy7");
            builder.withHtmlContent(html, new java.io.File("build/resources/main/").toURI().toString());
            builder.toStream(os);
            builder.run();
            return os.toByteArray();
        } catch (Exception e) {
            log.error("PDF 생성 실패", e);
            throw new BadRequestException(ExceptionCode.PDF_GENERATION_FAILED);
        }
    }

    private String buildHtml(TransferPortfolioResponse data) {
        String inlineCss = """
                <style type="text/css">
                    body {
                        font-family: 'Paperlogy5', sans-serif;
                        margin: 0;
                        padding: 30px;
                    }
                    h1 {
                        font-family: 'Paperlogy7', sans-serif;
                        font-size: 36px;
                    }
                    h2 {
                        font-size: 22px;
                        margin-top: 40px;
                    }
                    h3 {
                        font-size: 18px;
                        margin-top: 30px;
                    }
                    .payment-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        font-size: 14px;
                    }
                    .payment-table th,
                    .payment-table td {
                        border: 1px solid #ccc;
                        padding: 10px;
                        text-align: left;
                    }
                    .payment-table th {
                        background-color: #edf0f4;
                        font-weight: bold;
                    }
                    .container {
                        width: 210mm;
                        background-color: white;
                        box-sizing: border-box;
                        padding: 30px 36px 6px 36px;
                    }
                    .page {
                        width: 100%;
                        position: relative;
                        page-break-after: always;
                    }
                    .page:last-child {
                        page-break-after: auto !important;
                    }
                </style>
                """;

        TransferPortfolio portfolio = data.getTransferPortfolio(); // ✅ TransferPortfolio 추출
        Map<String, List<RentOutput>> rentMap = portfolio.getMonthlyRent(); // ✅ 월별 월세 맵
        Map<String, List<UtilityOutput>> utilityMap = portfolio.getMonthlyUtility(); // ✅ 월별 공과금 맵

        Set<String> allMonths = new TreeSet<>(); // 정렬된 month key
        allMonths.addAll(rentMap.keySet());
        allMonths.addAll(utilityMap.keySet());

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html lang=\"ko\"><head><meta charset=\"UTF-8\" />")
                .append(inlineCss)
                .append("</head><body><div class=\"container\">\n");

        html.append("<h1>cha:n G 납부 이력</h1>\n");
        html.append("<div>Contract ID: ").append(StringEscapeUtils.escapeHtml4(String.valueOf(data.getContractId())))
                .append("</div>\n");

        for (String month : allMonths) {
            html.append("<div class=\"page\">\n");
            html.append("<h3>").append(formatMonth(month)).append(" 납부 목록</h3>\n");
            html.append("<table class=\"payment-table\"><thead><tr>")
                    .append("<th>종류</th><th>보낸 사람</th><th>받는 사람</th><th>금액</th><th>상태</th><th>시간</th>")
                    .append("</tr></thead><tbody>\n");

            for (RentOutput r : rentMap.getOrDefault(month, List.of())) {
                html.append("<tr><td>월세</td><td>")
                        .append(StringEscapeUtils.escapeHtml4(r.getFrom())).append("</td><td>")
                        .append(StringEscapeUtils.escapeHtml4(r.getTo())).append("</td><td>")
                        .append(r.getAmount()).append("</td><td>")
                        .append(r.getStatus() ? "완료" : "대기").append("</td><td>")
                        .append(r.getTime()).append("</td></tr>\n");
            }

            for (UtilityOutput u : utilityMap.getOrDefault(month, List.of())) {
                html.append("<tr><td>공과금</td><td>")
                        .append(StringEscapeUtils.escapeHtml4(u.getFrom())).append("</td><td>")
                        .append(StringEscapeUtils.escapeHtml4(u.getTo())).append("</td><td>")
                        .append(u.getAmount()).append("</td><td>")
                        .append(u.getStatus() ? "완료" : "대기").append("</td><td>")
                        .append(u.getTime()).append("</td></tr>\n");
            }

            html.append("</tbody></table>\n</div>\n");
        }

        html.append("</div></body></html>");
        return html.toString();
    }

    private String formatMonth(String month) {
        if (month.length() == 5) {
            int year = Integer.parseInt(month.substring(0, 4));
            int mon = Integer.parseInt(month.substring(4));
            return year + "년 " + mon + "월";
        }
        return "알 수 없음";
    }

}
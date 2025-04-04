package com.ssafy.chaing.blockchain.pdf;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.ssafy.chaing.blockchain.handler.contract.output.PaymentInfoOutput;
import com.ssafy.chaing.blockchain.portfolio.output.ContractPortfolio;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ContractPdfGenerator implements PDFGenerator<ContractPortfolio> {

    @Override
    public byte[] generate(ContractPortfolio portfolio) {
        if (portfolio == null) {
            throw new BadRequestException(ExceptionCode.PDF_GENERATION_FAILED);
        }
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            String html = buildHtml(portfolio);
            PdfRendererBuilder builder = new PdfRendererBuilder();
            // 폰트를 클래스패스에서 직접 로드하여 등록합니다.
            builder.useFont(() -> getClass().getResourceAsStream("/font/Paperlogy-7Bold.ttf"), "Paperlogy7");
            builder.useFont(() -> getClass().getResourceAsStream("/font/Paperlogy-5Medium.ttf"), "Paperlogy5");
            // base URI를 클래스패스 루트로 설정 (CSS 내 폰트 파일 경로가 상대 경로로 해석됨)
            builder.withHtmlContent(html, getClass().getResource("/").toString());
            builder.toStream(os);
            builder.run();
            return os.toByteArray();
        } catch (Exception e) {
            log.error("PDF 생성 실패", e);
            throw new BadRequestException(ExceptionCode.PDF_GENERATION_FAILED);
        }
    }

    private String buildHtml(ContractPortfolio portfolio) throws IOException {
        // 인라인 CSS: @font-face 선언과 전체 스타일을 포함합니다.
        String inlineCss = """
                <style>
                /* @font-face 선언: 폰트 파일들은 /font 폴더 내에 있어야 함 */
                @font-face {
                    font-family: 'Paperlogy5';
                    src: url('font/Paperlogy-5Medium.ttf') format('truetype');
                }
                @font-face {
                    font-family: 'Paperlogy7';
                    src: url('font/Paperlogy-7Bold.ttf') format('truetype');
                }
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Paperlogy5', sans-serif;
                }
                .container {
                    width: 210mm;
                    background-color: white;
                    display: flex;
                    padding: 60px 46px 20px 46px;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    height: 297mm;
                    box-sizing: border-box;
                }
                .page {
                    width: 100%;
                    height: 257mm;
                    padding: 10mm;
                    position: relative;
                    page-break-after: always;
                }
                .toptop-container {
                    display: flex;
                    padding: 0 20px;
                    flex-direction: column;
                    gap: 20px;
                }
                .subtitle {
                    font-size: 18px;
                    font-family: 'Paperlogy5', sans-serif;
                    padding-left: 10px;
                }
                h1 {
                    font-size: 40px;
                    font-family: 'Paperlogy7', sans-serif;
                    padding-left: 10px;
                }
                .header-text-top,
                .header-text-blockchain {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .contract-id {
                    font-size: 18px;
                    padding-left: 10px;
                }
                .description {
                    font-size: 16px;
                    font-family: 'Paperlogy5', sans-serif;
                    padding: 10px 0 10px 10px;
                }
                .logo {
                    position: absolute;
                    top: 20mm;
                    right: 20mm;
                    width: 58px;
                    height: 58px;
                    background-color: #ddd;
                    border-radius: 50%;
                }
                .bottom-logo {
                    position: absolute;
                    bottom: 10mm;
                    font-size: 30px;
                    font-family: 'Paperlogy7', sans-serif;
                    width: 85%;
                    padding-top: 40px;
                    text-align: right;
                }
                .bottom-logo > span {
                    display: inline-block;
                }
                .bottom-container,
                .content-container,
                .middle-section {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }
                .second-section {
                    display: flex;
                    padding: 50px 10px;
                    font-size: 16px;
                    gap: 10px;
                }
                .contract-section {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    white-space: nowrap;
                }
                .section-row {
                    font-size: 16px;
                    font-family: 'Paperlogy5', sans-serif;
                }
                .user {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 18px 10px;
                    font-size: 16px;
                }
                .user-title {
                    background-color: #edf0f4;
                    font-family: 'Paperlogy7', sans-serif;
                    padding: 18px 10px;
                    border-bottom: 1px solid #000;
                }
                .user-total {
                    border-top: 1px solid #000;
                    font-weight: bold;
                }
                .total {
                    font-family: 'Paperlogy7', sans-serif;
                }
                .agreement-section {
                    width: 100%;
                    margin-bottom: 10px;
                    border-bottom: 1px solid black;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .agreement-first {
                    border-bottom: 1px solid rgb(189, 188, 192);
                    display: flex;
                    gap: 10px;
                    margin: 0 20px;
                }
                .agreement-first-title {
                    font-size: 15px;
                    font-family: 'Paperlogy7', sans-serif;
                    flex: 0 0 26%;
                    padding-left: 10px;
                }
                .agreement-list {
                    list-style-type: decimal;
                    margin-left: 20px;
                    font-family: 'Paperlogy5', sans-serif;
                    font-size: 14px;
                    width: 92%;
                    padding-bottom: 40px;
                }
                .line {
                    border-bottom: 1px solid black;
                    margin: 0 20px 10px;
                }
                .signature-section {
                    margin-top: 40px;
                    text-align: center;
                }
                .signature-date {
                    margin-bottom: 20px;
                    font-size: 16px;
                    padding-bottom: 100px;
                }
                .signature-box {
                    display: inline-block;
                    padding: 15px 20px;
                    border: 1px solid black;
                    margin-bottom: 20px;
                }
                .signature-names {
                    display: flex;
                    justify-content: space-between;
                    width: 200px;
                }
                .signature-names span {
                    padding: 0 10px;
                }
                .signature-stamp {
                    display: flex;
                    justify-content: space-between;
                    width: 200px;
                    margin: 10px auto;
                }
                .stamp {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background-color: #ffeeee;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12px;
                    color: #ff0000;
                }
                .footer-text {
                    font-size: 12px;
                    margin-top: 30px;
                    text-align: center;
                }
                .page-number {
                    position: absolute;
                    bottom: 0mm;
                    text-align: center;
                    width: 100%;
                    font-family: 'Paperlogy5', sans-serif;
                    font-size: 12px;
                    margin-top: 20mm;
                }
                </style>
                """;

        // Payment 정보 생성
        StringBuilder paymentInfoHtml = new StringBuilder();
        BigInteger totalAmount = BigInteger.ZERO;
        int totalRatio = 0;
        List<PaymentInfoOutput> infos = portfolio.getPaymentInfos();
        if (infos != null) {
            for (PaymentInfoOutput info : infos) {
                paymentInfoHtml.append("<div class='user'>")
                        .append("<div>").append(safe(info.getUserId())).append("</div>")
                        .append("<div>").append(safe(info.getRatio())).append("</div>")
                        .append("<div>").append(safe(info.getAmount())).append("원</div>")
                        .append("</div>");
                if (info.getAmount() != null) {
                    totalAmount = totalAmount.add(info.getAmount());
                }
                if (info.getRatio() != null) {
                    totalRatio += info.getRatio().intValue();
                }
            }
        }
        String names = (infos != null) ? infos.stream()
                .map(info -> safe(info.getUserId()))
                .collect(Collectors.joining("</span><span>"))
                : "";
        String signatureStamps = (infos != null) ? infos.stream()
                .map(i -> "<div class='stamp'>인</div>")
                .collect(Collectors.joining())
                : "";

        return String.format("""
                        <!DOCTYPE html>
                        <html lang='ko'>
                        <head>
                            <meta charset='UTF-8' />
                            <title>cha:n G 서약서</title>
                            %s
                        </head>
                        <body>
                            <div class='container'>
                                <div class='page' id='page1'>
                                    <div class='logo'>로고</div>
                                    <div class='toptop-container'>
                                        <div class='header-text-top'>
                                            <div class='header-text-blockchain'>
                                                <div class='subtitle'>블록체인 기반</div>
                                                <h1>cha:n G 서약서</h1>
                                            </div>
                                            <div class='contract-id'>서약서 ID : %s</div>
                                        </div>
                                        <div class='description'>해당 서약서는 모든 사람의 승인 하에 생성된 서약서 입니다.</div>
                                        <div class='bottom-container'>
                                            <div class='content-container'>
                                                <div class='middle-section'>
                                                    <div class='second-section'>
                                                        <div class='contract-section'>
                                                            <div class='total'>서약 기간</div>
                                                            <div class='section-row'>시작일 : %s</div>
                                                            <div class='section-row'>종료일 : %s</div>
                                                        </div>
                                                        <div class='contract-section'>
                                                            <div class='total'>월세</div>
                                                            <div class='section-row'>월세 총액 : %s</div>
                                                            <div class='section-row'>월세 지불일 : 매월 %s일</div>
                                                        </div>
                                                    </div>
                                                    <div class='user user-title'>
                                                        <div class='total'>월세 지불 정보</div>
                                                        <div>분배 비율(%%)</div>
                                                        <div>지불액(원)</div>
                                                    </div>
                                                    %s
                                                    <div class='user user-total'>
                                                        <div class='total'>총</div>
                                                        <div>%d</div>
                                                        <div>%s원</div>
                                                    </div>
                                                    <div class='second-section'>
                                                        <div class='contract-section'>
                                                            <div class='total'>계좌</div>
                                                            <div class='section-row'>cha:nG 계좌 : %s</div>
                                                            <div class='section-row'>집주인 계좌 : %s</div>
                                                        </div>
                                                        <div class='contract-section'>
                                                            <div class='total'>공과금</div>
                                                            <div class='section-row'>분배 비율 (%%) : %s</div>
                                                            <div class='section-row'>공과금 카드 ID : %s</div>
                                                        </div>
                                                    </div>
                                                    <div class='bottom-logo'>cha:n G</div>
                                                    <div class='page-number'>- 1 -</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                            <div class='container'>
                                <div class='page' id='page2'>
                                    <div class='line'></div>
                                    <div class='agreement-section'>
                                        <div class='agreement-first'>
                                            <div class='agreement-first-title'>서약해지 및 수정규정</div>
                                            <div>
                                                <ol class='agreement-list'>
                                                    <li>서약 해재를 원할 경우, 일정 기간의 예고와 상호협의가 필요합니다</li>
                                                    <li>변동사항이 있을 경우 기존 서약서는 파기하고, 새로운 서약서를 생성해야 됩니다.</li>
                                                </ol>
                                            </div>
                                        </div>
                                        <div class='agreement-first'>
                                            <div class='agreement-first-title'>블록체인 기반 서약서</div>
                                            <div>
                                                <ol class='agreement-list'>
                                                    <li>서약서는 블록체인 기술을 활용하여 기록되며, 투명하게 관리됩니다.</li>
                                                    <li>서약서는 임의로 수정, 변경이 불가능합니다.</li>
                                                    <li>서약서는 블록체인에 저장되어 ‘폴라곤스캔’사이트에서 상시 확인가능합니다. 자세한 내용은 cha:nG 사이트를 확인해 주세요.</li>
                                                </ol>
                                            </div>
                                        </div>
                                        <div class='agreement-first'>
                                            <div class='agreement-first-title'>법적 효력</div>
                                            <div>
                                                <ol class='agreement-list'>
                                                    <li>서약서는 참여자 간의 합의에 의해 효력을 발생하며, 모든 참여자는 해당 서약을 준수할 의무가 있습니다.</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='signature-section'>
                                        <div class='signature-date'>서약서 최종 승인일: %s</div>
                                        <div class='signature-box'>
                                            <div class='signature-names'>
                                                <span>%s</span>
                                            </div>
                                            <div class='signature-stamp'>
                                                %s
                                            </div>
                                        </div>
                                    </div>
                                    <div class='footer-text'>이 계약서는 서명일부터 유효하며, 계약 종료 후 자동으로 종료됩니다.</div>
                                    <div class='bottom-logo'><span>cha:n G</span></div>
                                    <div class='page-number'>- 2 -</div>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                inlineCss,
                safe(portfolio.getId()),
                safe(portfolio.getStartDate()),
                safe(portfolio.getEndDate()),
                safe(portfolio.getRentTotalAmount()),
                safe(portfolio.getRentDueDate()),
                paymentInfoHtml.toString(),
                totalRatio,
                totalAmount.toString(),
                safe(portfolio.getRentAccountNo()),
                safe(portfolio.getOwnerAccountNo()),
                safe(portfolio.getUtilitySplitRatio()),
                safe(portfolio.getCardId()),
                "2025년 4월 2일",
                names,
                signatureStamps
        );
    }

    private String safe(Object o) {
        return o != null ? o.toString() : "N/A";
    }
}

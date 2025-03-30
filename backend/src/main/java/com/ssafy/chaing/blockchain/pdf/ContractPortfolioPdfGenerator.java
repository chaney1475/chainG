package com.ssafy.chaing.blockchain.pdf;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.ssafy.chaing.blockchain.handler.contract.output.PaymentInfoOutput;
import com.ssafy.chaing.blockchain.portfolio.output.ContractPortfolio;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;

@Component // Spring Bean으로 등록
public class ContractPortfolioPdfGenerator implements PDFGenerator<ContractPortfolio> {

    @Override
    public byte[] generate(ContractPortfolio portfolio){
        if (portfolio == null) {
            throw new IllegalArgumentException("Portfolio data cannot be null");
        }

        try (ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
             PdfWriter writer = new PdfWriter(byteStream);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf)) {

            // 제목 추가
            Paragraph title = new Paragraph("Contract Portfolio Details")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontSize(16);
            document.add(title);
            document.add(new Paragraph("\n")); // 공백 라인

            // 데이터 추가
            document.add(new Paragraph("Contract ID: " + safeToString(portfolio.getId())));
            document.add(new Paragraph("Start Date: " + safeToString(portfolio.getStartDate())));
            document.add(new Paragraph("End Date: " + safeToString(portfolio.getEndDate())));
            document.add(new Paragraph("Rent Total Amount: " + safeToString(portfolio.getRentTotalAmount())));
            document.add(new Paragraph("Rent Due Date (Day): " + safeToString(portfolio.getRentDueDate())));
            document.add(new Paragraph("Rent Account No: " + safeToString(portfolio.getRentAccountNo())));
            document.add(new Paragraph("Owner Account No: " + safeToString(portfolio.getOwnerAccountNo())));
            document.add(new Paragraph("Rent Total Ratio (%): " + safeToString(portfolio.getRentTotalRatio())));
            document.add(new Paragraph("Live Account No: " + safeToString(portfolio.getLiveAccountNo())));
            document.add(new Paragraph("Utility Enabled: " + safeToString(portfolio.getIsUtilityEnabled())));
            document.add(new Paragraph("Utility Split Ratio (%): " + safeToString(portfolio.getUtilitySplitRatio())));
            document.add(new Paragraph("Card ID: " + safeToString(portfolio.getCardId())));

            // Payment Infos 리스트 처리
            if (portfolio.getPaymentInfos() != null && !portfolio.getPaymentInfos().isEmpty()) {
                document.add(new Paragraph("\nPayment Information:").setBold());
                for (PaymentInfoOutput payment : portfolio.getPaymentInfos()) {
                    document.add(new Paragraph("  - UserId: " + safeToString(payment.getUserId())
                            + ", Amount: " + safeBigIntToString(payment.getAmount()) // BigInteger 처리
                            + ", Ratio: " + safeToString(payment.getRatio())
                    ).setMarginLeft(20));
                }
            } else {
                document.add(new Paragraph("\nNo Payment Information available."));
            }

            document.close(); // Document 닫기 (필수)
            return byteStream.toByteArray();
        } catch (IOException e) {
            throw new BadRequestException(ExceptionCode.PDF_GENERATION_FAILED);
        }
    }

    private String safeToString(Object obj) {
        return obj != null ? obj.toString() : "N/A";
    }

    private String safeBigIntToString(BigInteger bi) {
        return bi != null ? bi.toString() : "N/A";
    }
}

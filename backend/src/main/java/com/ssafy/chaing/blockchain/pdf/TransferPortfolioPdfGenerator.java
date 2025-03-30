package com.ssafy.chaing.blockchain.pdf;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.ssafy.chaing.blockchain.handler.rent.output.RentOutput;
import com.ssafy.chaing.blockchain.handler.utility.output.UtilityOutput;
import com.ssafy.chaing.blockchain.portfolio.output.TransferPortfolio;
import com.ssafy.chaing.blockchain.portfolio.output.TransferPortfolioList;
import com.ssafy.chaing.common.exception.BadRequestException;
import com.ssafy.chaing.common.exception.ExceptionCode;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TransferPortfolioPdfGenerator implements PDFGenerator<TransferPortfolioList> {

    // --- Constants for Styling ---
    private static final float FONT_SIZE_MAIN_TITLE = 18f;
    private static final float FONT_SIZE_USER_HEADER = 14f;
    private static final float FONT_SIZE_SECTION_TITLE = 12f;
    private static final float FONT_SIZE_DEFAULT = 10f;
    private static final float FONT_SIZE_EMPTY_MSG = 10f;

    private static final float MARGIN_BOTTOM_MAIN_TITLE = 20f;
    private static final float MARGIN_TOP_USER_SECTION = 15f;
    private static final float MARGIN_BOTTOM_USER_HEADER = 10f;
    private static final float MARGIN_LEFT_SECTION_TITLE = 10f;
    private static final float MARGIN_BOTTOM_SECTION_TITLE = 5f;
    private static final float MARGIN_LEFT_ITEM = 20f;
    private static final float MARGIN_BOTTOM_ITEM = 8f;
    private static final float MARGIN_TOP_SECTION_GAP = 10f; // Gap between Rent/Utility sections
    private static final float MARGIN_BOTTOM_EMPTY_MSG = 10f;

    private static final String RENT_SECTION_TITLE = "월세 이체 내역";
    private static final String UTILITY_SECTION_TITLE = "공과금 이체 내역";
    private static final String MSG_NO_DATA_FOR_CONTRACT = "이채 내역이 비어있습니다.";
    private static final String MSG_NO_RENT_TRANSFERS = "  월세 이체 내역이 비어있습니다.";
    private static final String MSG_NO_UTILITY_TRANSFERS = "  공과금 이체 내역이 비어있습니다.";
    private static final String MSG_UNKNOWN_TRANSFER_TYPE = "  알 수 없는 이체 내역입니다.";

    @Override
    public byte[] generate(TransferPortfolioList portfolioList) {
        validateInput(portfolioList);
        String contractIdStr = safeToString(portfolioList.getContractId()); // Get once

        try (ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
             PdfWriter writer = new PdfWriter(byteStream);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = setupDocument(pdf)) { // Extract document setup

            addMainTitle(document, contractIdStr);
            addTransferDetails(document, portfolioList.getTransferPortfolioList());

            document.close(); // Finalize document
            return byteStream.toByteArray();

        } catch (Exception e) {
            throw new BadRequestException(ExceptionCode.PDF_GENERATION_FAILED);
        }
    }

    private void validateInput(TransferPortfolioList portfolioList) {
        if (portfolioList == null || portfolioList.getTransferPortfolioList() == null) {
            throw new BadRequestException(ExceptionCode.TRANSFER_PORTFOLIO_IS_NULL);
        }
    }

    private Document setupDocument(PdfDocument pdf) throws IOException {
        Document document = new Document(pdf);
        // ** Font Loading - Improved **
        // TODO: Replace with actual font loading logic (e.g., from injected fontPath)
        // if (fontPath != null && !fontPath.isEmpty()) {
        //     try {
        //         PdfFont font = PdfFontFactory.createFont(fontPath, PdfEncodings.IDENTITY_H, true);
        //         document.setFont(font);
        //     } catch (IOException e) {
        //         log.warn("Failed to load custom font from path: {}. Using default.", fontPath, e);
        //         setFallbackFont(document); // Use a fallback if custom font fails
        //     }
        // } else {
        //     setFallbackFont(document); // Use fallback if no path is configured
        // }
        setFallbackFont(document); // Keep fallback for now
        return document;
    }

    private void setFallbackFont(Document document) throws IOException {
        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        document.setFont(font);
    }


    private void addMainTitle(Document document, String contractIdStr) {
        Paragraph mainTitle = new Paragraph("Transfer Details for Contract ID: " + contractIdStr)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setFontSize(FONT_SIZE_MAIN_TITLE)
                .setMarginBottom(MARGIN_BOTTOM_MAIN_TITLE);
        document.add(mainTitle);
    }

    private void addTransferDetails(Document document, List<TransferPortfolio> userPortfolios) {
        if (userPortfolios.isEmpty()) {
            document.add(new Paragraph(MSG_NO_DATA_FOR_CONTRACT).setTextAlignment(TextAlignment.CENTER));
            return;
        }

        for (TransferPortfolio userPortfolio : userPortfolios) {
            if (userPortfolio != null) {
                addUserSection(document, userPortfolio);
                document.add(new Paragraph("\n")); // Add space between users
            }
        }
    }

    private void addUserSection(Document document, TransferPortfolio userPortfolio) {
        // User Header
        Paragraph userHeader = new Paragraph()
                .add(new Text("User: " + safeToString(userPortfolio.getName())).setBold().setFontSize(FONT_SIZE_USER_HEADER))
                .add(" (ID: " + safeToString(userPortfolio.getId()) + ")")
                .setMarginTop(MARGIN_TOP_USER_SECTION)
                .setMarginBottom(MARGIN_BOTTOM_USER_HEADER);
        document.add(userHeader);

        // Add Rent and Utility Sections using a generalized helper
        addTransferSection(document, RENT_SECTION_TITLE, userPortfolio.getRentOutputList(), MSG_NO_RENT_TRANSFERS);
        // Add a small gap between rent and utility sections for clarity
        document.add(new Paragraph("").setMarginTop(MARGIN_TOP_SECTION_GAP));
        addTransferSection(document, UTILITY_SECTION_TITLE, userPortfolio.getUtilityOutputList(), MSG_NO_UTILITY_TRANSFERS);
    }

    private <T> void addTransferSection(Document document, String title, List<T> transfers, String emptyMessage) {
        // Section Title
        document.add(new Paragraph(title)
                .setBold()
                .setFontSize(FONT_SIZE_SECTION_TITLE)
                .setMarginLeft(MARGIN_LEFT_SECTION_TITLE)
                .setMarginBottom(MARGIN_BOTTOM_SECTION_TITLE));

        // Transfer Items or Empty Message
        if (transfers != null && !transfers.isEmpty()) {
            for (T transfer : transfers) {
                if (transfer != null) { // Add null check for items in list
                    document.add(createTransferParagraph(transfer).setMarginLeft(MARGIN_LEFT_ITEM));
                }
            }
        } else {
            document.add(new Paragraph(emptyMessage)
                    .setMarginLeft(MARGIN_LEFT_ITEM)
                    .setMarginBottom(MARGIN_BOTTOM_EMPTY_MSG)
                    .setFontSize(FONT_SIZE_EMPTY_MSG));
        }
    }


    private Paragraph createTransferParagraph(Object transferOutput) {
        // Use pattern matching for instanceof (Java 16+) for slightly cleaner code
        String type;
        BigInteger id, accountId, month, amount;
        String from, to, time;
        Boolean status;

        if (transferOutput instanceof RentOutput rent) {
            type = "Rent";
            id = rent.getId();
            accountId = rent.getAccountId();
            month = rent.getMonth();
            from = rent.getFrom();
            to = rent.getTo();
            amount = rent.getAmount();
            status = rent.getStatus();
            time = rent.getTime();
        } else if (transferOutput instanceof UtilityOutput utility) {
            type = "Utility";
            id = utility.getId();
            accountId = utility.getAccountId();
            month = utility.getMonth();
            from = utility.getFrom();
            to = utility.getTo();
            amount = utility.getAmount();
            status = utility.getStatus();
            time = utility.getTime();
        } else {
            return new Paragraph(MSG_UNKNOWN_TRANSFER_TYPE).setFontSize(FONT_SIZE_DEFAULT).setItalic();
        }

        // Build the paragraph content
        Paragraph p = new Paragraph().setMarginBottom(MARGIN_BOTTOM_ITEM).setFontSize(FONT_SIZE_DEFAULT);
        p.add(new Text("[" + type + "] ").setBold());
        p.add("ID: " + safeBigIntToString(id));
        p.add(", Month: " + safeBigIntToString(month));
        p.add(", AccID: " + safeBigIntToString(accountId));
        p.add("\n  From: " + safeToString(from) + " -> To: " + safeToString(to)); // Indent next lines
        p.add("\n  Amount: " + safeBigIntToString(amount));
        p.add(", Status: " + formatStatus(status));
        p.add(", Time: " + safeToString(time));

        return p;
    }

    private String formatStatus(Boolean status) {
        if (status == null) return "N/A";
        return status ? "Completed" : "Pending";
    }

    private String safeToString(Object obj) {
        return obj != null ? obj.toString() : "N/A";
    }

    private String safeBigIntToString(BigInteger bi) {
        return bi != null ? bi.toString() : "N/A";
    }
}
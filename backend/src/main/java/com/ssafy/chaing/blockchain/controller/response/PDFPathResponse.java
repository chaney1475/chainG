package com.ssafy.chaing.blockchain.controller.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PDFPathResponse {
    private String presignedUrl;
}

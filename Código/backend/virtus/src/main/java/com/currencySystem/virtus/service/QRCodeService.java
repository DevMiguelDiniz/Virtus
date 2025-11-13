package com.currencySystem.virtus.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class QRCodeService {

    private static final int QR_CODE_SIZE = 200; // Reduzido para 200x200 para emails
    private static final String IMAGE_FORMAT = "PNG";

    /**
     * Gera um QR Code em formato Base64 para ser embedado em emails
     *
     * @param content Conteúdo do QR Code (geralmente o código de resgate)
     * @return String Base64 do QR Code
     */
    public String generateQRCodeBase64(String content) {
        try {
            log.info("Gerando QR Code para: {}", content);

            // Configurações do QR Code
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M); // Média correção (otimizado para emails)
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 1); // Margem mínima

            // Gera a matriz do QR Code
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(
                content,
                BarcodeFormat.QR_CODE,
                QR_CODE_SIZE,
                QR_CODE_SIZE,
                hints
            );

            // Converte para BufferedImage
            BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

            // Converte para Base64
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(qrImage, IMAGE_FORMAT, outputStream);
            byte[] imageBytes = outputStream.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            log.info("QR Code gerado com sucesso. Tamanho: {} bytes", imageBytes.length);

            return "data:image/png;base64," + base64Image;

        } catch (WriterException e) {
            log.error("Erro ao gerar matriz do QR Code", e);
            throw new RuntimeException("Erro ao gerar QR Code: " + e.getMessage(), e);
        } catch (IOException e) {
            log.error("Erro ao converter QR Code para Base64", e);
            throw new RuntimeException("Erro ao processar imagem do QR Code: " + e.getMessage(), e);
        }
    }

    /**
     * Gera um QR Code sem o prefixo data:image/png;base64,
     * Útil para casos onde o prefixo é adicionado externamente
     *
     * @param content Conteúdo do QR Code
     * @return String Base64 pura do QR Code
     */
    public String generateQRCodeBase64Raw(String content) {
        String fullBase64 = generateQRCodeBase64(content);
        return fullBase64.replace("data:image/png;base64,", "");
    }

    /**
     * Valida se um conteúdo pode ser codificado em QR Code
     *
     * @param content Conteúdo a ser validado
     * @return true se válido, false caso contrário
     */
    public boolean isValidContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            return false;
        }

        // QR Code tem limite de ~4000 caracteres alfanuméricos
        // Vamos usar um limite conservador
        return content.length() <= 500;
    }
}

import emailjs from '@emailjs/browser';

interface EmailResgateParams {
    toEmail: string;
    toName: string;
    vantagemNome: string;
    codigoResgate: string;
    valorMoedas: number;
    dataResgate: string;
    qrCodeBase64: string;
    resgateUrl: string;
}

/**
 * Serviço para envio de emails usando EmailJS
 */
class EmailService {
    private serviceId: string;
    private templateId: string;
    private publicKey: string;
    private enabled: boolean;

    constructor() {
        this.serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
        this.templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
        this.publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
        this.enabled = process.env.NEXT_PUBLIC_EMAILJS_ENABLED !== 'false';
    }

    /**
     * Verifica se o EmailJS está configurado
     */
    isConfigured(): boolean {
        return !!(this.serviceId && this.templateId && this.publicKey);
    }

    /**
     * Envia email de resgate com QR Code
     */
    async enviarEmailResgate(params: EmailResgateParams): Promise<void> {
        if (!this.enabled) {
            console.warn('EmailJS está desabilitado');
            return;
        }

        if (!this.isConfigured()) {
            console.error('EmailJS não está configurado. Verifique as variáveis de ambiente.');
            return;
        }

        try {
            console.log('Enviando email de resgate para:', params.toEmail);
            console.log('Service ID:', this.serviceId);
            console.log('Template ID:', this.templateId);
            console.log('Public Key:', this.publicKey);

            const templateParams = {
                to_name: params.toName,
                to_email: params.toEmail,
                vantagem_nome: params.vantagemNome,
                codigo_resgate: params.codigoResgate,
                valor_moedas: params.valorMoedas.toString(),
                data_resgate: params.dataResgate,
                qr_code_base64: params.qrCodeBase64,
                resgate_url: params.resgateUrl,
                reply_to: 'virtuscurrency@gmail.com',
            };

            console.log('Template params:', {
                ...templateParams,
                qr_code_base64: templateParams.qr_code_base64.substring(0, 50) + '...' // Trunca para não poluir o log
            });

            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams,
                {
                    publicKey: this.publicKey,
                }
            );

            console.log('✓ Email enviado com sucesso:', response);
        } catch (error: any) {
            console.error('✗ Erro ao enviar email:', error);
            console.error('Detalhes do erro:', {
                status: error.status,
                text: error.text,
                message: error.message
            });
            // Não propaga o erro para não quebrar o fluxo de resgate
        }
    }

    /**
     * Envia email genérico
     */
    async enviarEmailGenerico(
        toEmail: string,
        toName: string,
        subject: string,
        message: string
    ): Promise<void> {
        if (!this.enabled || !this.isConfigured()) {
            return;
        }

        try {
            const templateParams = {
                to_email: toEmail,
                to_name: toName,
                subject,
                message,
                from_name: 'Sistema Virtus',
                reply_to: 'noreply@virtus.com',
            };

            await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams,
                this.publicKey
            );

            console.log('✓ Email genérico enviado para:', toEmail);
        } catch (error) {
            console.error('✗ Erro ao enviar email genérico:', error);
        }
    }
}

// Exporta instância única
export const emailService = new EmailService();

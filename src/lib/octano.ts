// /lib/octano.ts
import axios from "axios";

export interface PaymentData {
    amount: number;
    orderId: string;
    currency?: string;
    cardData: {
        number: string;
        name: string;
        month: string;
        year: string;
        cvv: string;
    };
    customer: {
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        direccion: string;
        direccion2?: string;
        ciudad: string;
        estado: string;
        pais?: string;
        cp: string;
        empresa?: string;
    };
    metadata?: {
        ip?: string;
        deviceId?: string;
        notes?: string;
    };
}

const OCTANO_BASE_URL = "https://pagos.octanopayments.com/api/v1";

export async function processOctanoPayment(payment: PaymentData) {
    try {
        // Autenticación
        const authResponse = await axios.post(`${OCTANO_BASE_URL}/signin`, {
            email: process.env.OCTANO_EMAIL,       // Asegura que coincida con tus variables de entorno
            password: process.env.OCTANO_PASSWORD,
        }, {
            headers: { accept: "application/json", "content-type": "application/json" },
        });

        const authToken = authResponse.data?.authToken;
        if (!authToken) throw new Error("No se pudo obtener el token de Octano.");

        const config = {
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        };

        // Tokenización de la tarjeta
        const tokenResponse = await axios.post(`${OCTANO_BASE_URL}/card/tokenizer`, {
            cardData: {
                cardNumber: payment.cardData.number.replace(/\s/g, ""),
                cardholderName: payment.cardData.name,
                expirationYear: payment.cardData.year,
                expirationMonth: payment.cardData.month,
            },
        }, config);

        const cardToken = tokenResponse.data?.cardNumberToken;
        if (!cardToken) throw new Error("No se pudo tokenizar la tarjeta.");

        // Sale Request
        const salePayload = {
            amount: Number(payment.amount),
            currency: payment.currency === "USD" ? "840" : "484",
            reference: payment.orderId,
            customerInformation: {
                firstName: payment.customer.nombre?.trim() || "N/A",
                lastName: payment.customer.apellido?.trim() || "N/A",
                email: payment.customer.email,
                phone1: payment.customer.telefono,
                address1: payment.customer.direccion,
                address2: payment.customer.direccion2 || "",
                city: payment.customer.ciudad,
                state: payment.customer.estado,
                postalCode: payment.customer.cp,
                country: payment.customer.pais || "MX",
                ip: payment.metadata?.ip || "127.0.0.1", 
            },
            cardData: {
                cardNumberToken: cardToken,
                cvv: payment.cardData.cvv,
            },
        };

        const saleResponse = await axios.post(`${OCTANO_BASE_URL}/sale`, salePayload, config);

        return {
            success: saleResponse.data.status == "APPROVED",
            data: saleResponse.data,
        };
    } catch (error: any) {
        console.error("Error en pasarela Octano:", error?.response?.data || error?.message);
        return {
            success: false,
            error: error?.response?.data?.message || error?.response?.data?.error || "Hubo un problema al procesar la transacción.",
        };
    }
}
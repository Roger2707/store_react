export interface PaymentProcessingResponse {
    requestId: string
    success: boolean
    paymentIntentId: string
    clientSecret: string
    message: string
    status: number
}
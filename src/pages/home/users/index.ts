export { AdminRefund } from './adminRefund'

export interface VerificationAccount extends Omit<RefundData, 'id' | 'orderId' | 'reason' | 'createdAt'> {
    nik: string
    image: string
    name: string
    dob: string
    address: string
    phoneNumber: string
}

export interface RefundData {
    id: string
    bankAccount: string
    bankName: string
    bankAccountName: string
    orderId: string
    reason: string
    createdAt: string
    amount: number
    totalAmount?: number
}

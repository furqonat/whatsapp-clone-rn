import { IContact } from './contact'

interface TransactionObject {
    transactionType: string
    transactionAmount: number
    transactionStatus: string
    transactionFee: number
    transactionName: string
    receiverInfo: IContact
}

interface ITransactions extends TransactionObject {
    id: string
    senderUid: string
    senderPhoneNumber: string
    receiverUid: string
    receiverPhoneNumber: string
    createdAt: string
    status: string
    transactionToken?: {
        redirect_url: string
        token: string
    } | null
    payment_type?: string | null
    refund?: {
        reason: string
        amount: number
        createdAt: string
        requestBy: string
    } | null
    seller: string
}

export { TransactionObject, ITransactions }

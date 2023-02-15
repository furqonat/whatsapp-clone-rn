import { IContact } from "utils"

type RootStackParamList = {
    signin: undefined
    otp: {
        provider: 'phone' | 'whatsapp'
    }
    form: undefined
    tabbar: undefined
    chat: undefined
    chatItem:
    | {
        chatId?: string | null
        phoneNumber?: string | null
    }
    | undefined
    profile: undefined
    profile_diri: undefined
    profile_publik: undefined
    tentang_kami: undefined
    privasi: undefined
    settings: undefined
    qr: undefined,
    transaction: undefined,
    new_transaction: {
        contact: IContact | null
    },
    change_phone: {
        new_phone: string
    },
    refund: {
        transactionId: string
    }
}

export type { RootStackParamList }

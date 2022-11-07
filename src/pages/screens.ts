import { IChatItem } from "utils"

type RootStackParamList = {
    signin: undefined,
    otp: undefined,
    form: undefined,
    tabbar: undefined,
    chat: undefined,
    chatItem: {
        chatId?: string | null,
        chatItem?: IChatItem | null
    } | undefined,
    profile: undefined,
    settings: undefined,
}

export type { RootStackParamList }
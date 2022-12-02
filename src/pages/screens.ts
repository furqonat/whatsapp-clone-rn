type RootStackParamList = {
    signin: undefined
    otp: undefined
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
    settings: undefined
    qr: undefined
}

export type { RootStackParamList }

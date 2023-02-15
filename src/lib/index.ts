const encrypt = (salt: string) => {
    const textToChars = (text: string) => text.split('').map((c: string) => c.charCodeAt(0))
    const byteHex = (n: any) => ('0' + Number(n).toString(16)).substr(-2)
    const applySaltToChar = (code: any) => textToChars(salt).reduce((a: number, b: number) => a ^ b, code)

    return (text: string) => text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('')
}

export { encrypt }
export * from './preferences'

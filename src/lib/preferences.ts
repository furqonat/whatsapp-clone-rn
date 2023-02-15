import * as SecureStore from 'expo-secure-store';

const getValue = async (key: string) => {
    return new Promise((resolve, reject) => {
        SecureStore.getItemAsync(key)
            .then((value) => {
                resolve(value)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

const setValue = (key: string, value: any) => {
    return new Promise<void>((resolve, reject) => {
        SecureStore.setItemAsync(key, value)
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export { getValue, setValue }
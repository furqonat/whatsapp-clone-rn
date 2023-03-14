import firestore from '@react-native-firebase/firestore'
import { useEffect, useState } from 'react'
import { ITransactions } from 'utils'

const useTransactions = (props: { userId?: string | undefined }) => {
    const [transactions, setTransactions] = useState<ITransactions[] | null>(null)

    useEffect(() => {
        if (props?.userId) {
            /*const refs = collection(db, 'transactions')
            const subscribe = onSnapshot(refs, (snapshots) => {
                const value: ITransactions[] = []
                snapshots.docs.forEach((doc) => {

                    if (doc.data().id.includes(props?.userId)) {
                        value.push({ ...doc.data() as ITransactions, id: doc.id })
                    }
                })
                setTransactions(value.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                }))
            })
            return () => {
                subscribe()
            }*/
            const unsubscribe = firestore()
                .collection('transactions')
                .onSnapshot(querySnapshot => {
                    const value: ITransactions[] = []
                    querySnapshot.docs.forEach(doc => {
                        if (
                            doc.data().id.includes(props?.userId) ||
                            doc.data().receiverUid === props?.userId ||
                            doc.data().senderUid === props?.userId
                        ) {
                            value.push({ ...(doc.data() as ITransactions), id: doc.id })
                        }
                    })
                    setTransactions(
                        value.sort((a, b) => {
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        })
                    )
                })
            return () => unsubscribe
        } else {
            return () => {}
        }
    }, [props?.userId])

    return {
        transactions,
    }
}

export { useTransactions }

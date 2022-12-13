import { collection, onSnapshot } from "firebase/firestore"
import { useState, useEffect } from "react"
import { ITransactions, db } from "utils"

const useTransactions = (props: { userId?: string | undefined }) => {

    const [transactions, setTransactions] = useState<ITransactions[] | null>(null)

    useEffect(() => {
        if (props?.userId) {
            const refs = collection(db, 'transactions')
            const subscribe = onSnapshot(refs, (snapshots) => {
                const value: ITransactions[] = []
                snapshots.docs.forEach((doc) => {

                    if (doc.data().id.includes(props?.userId)) {
                        value.push(doc.data() as ITransactions)
                    }
                })
                setTransactions(value.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                }))
            })
            return () => {
                subscribe()
            }
        } else {
            return () => { }
        }
    }, [props?.userId])
    
    return {
        transactions
    }

}

export { useTransactions }
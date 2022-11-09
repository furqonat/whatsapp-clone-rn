import { doc, getDoc, updateDoc } from "@firebase/firestore"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage'
import { useToast } from "native-base"
import { useEffect, useState } from "react"
import { db } from "utils"

const useAvatar = (props: { phoneNumber?: string | null }) => {

    const { phoneNumber } = props
    const toast = useToast()
    const toastId = 'avatar'

    const [avatar, setAvatar] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    // get an avatar from firebase collection of users
    useEffect(() => {
        if (phoneNumber) {
            setLoading(true)
            const dbRef = doc(db, "users", phoneNumber)
            getDoc(dbRef).then((doc) => {
                if (doc.exists()) {
                    setAvatar(doc.data().photoURL)
                    setLoading(false)
                }
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [phoneNumber])

    const uploadAvatar = (file: File) => {
        const storage = getStorage()
        const storageRef = ref(storage, `${phoneNumber}/avatar/${file.name}`)
        const task = uploadBytesResumable(storageRef, file)
        task.on('state_changed', (snapshot) => {
            const progressUpload = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setProgress(progressUpload)
        }, (_error) => {
            if (!toast.isActive(toastId)) {
                toast.show({
                    id: toastId,
                    title: "Error while uploading a avatar"
                })
            }
        }, () => {
            getDownloadURL(task.snapshot.ref).then((downloadURL) => {
                setAvatar(downloadURL)
                const dbRef = doc(db, "users", `${phoneNumber}`)
                updateDoc(dbRef, {
                    photoURL: downloadURL
                }).then(() => {
                })
            })
        })
    }

    return {
        avatar,
        loading, 
        progress,
        uploadAvatar
    }
}

export { useAvatar }
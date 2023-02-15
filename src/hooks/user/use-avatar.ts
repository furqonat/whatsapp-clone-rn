import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from '@firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage'
import { useToast } from 'native-base'
import { useEffect, useState } from 'react'
import { db } from 'utils'

const useAvatar = (props: { uid?: string | null }) => {
    const { uid } = props
    const toast = useToast()
    const toastId = 'avatar'

    const [avatar, setAvatar] = useState('')
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    // get an avatar from firebase collection of users
    useEffect(() => {
        if (uid) {
            setLoading(true)
            const dbRef = query(collection(db, 'users'), where('uid', '==', uid))
            onSnapshot(dbRef, querySnapshot => {
                if (querySnapshot.empty) {
                    if (!toast.isActive(toastId)) {
                        toast.show({
                            id: toastId,
                            title: 'No such user'
                        })
                    }
                    setLoading(false)
                } else {
                    querySnapshot.forEach(doc => {
                        setAvatar(doc.data().photoURL)
                    })
                    setLoading(false)
                }
            })
        }
    }, [uid])

    const uploadAvatar = (file: File): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            const storage = getStorage()
            const storageRef = ref(storage, `${uid}/avatar/${file.name}`)
            const task = uploadBytesResumable(storageRef, file)
            task.on(
                'state_changed',
                snapshot => {
                    const progressUpload = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setProgress(progressUpload)
                },
                _error => {
                    if (!toast.isActive(toastId)) {
                        toast.show({
                            id: toastId,
                            title: 'Error while uploading a avatar',
                        })
                    }
                },
                () => {
                    getDownloadURL(task.snapshot.ref).then(downloadURL => {
                        setAvatar(downloadURL)
                        const dbRef = query(collection(db, 'users'), where('uid', '==', uid))
                        getDocs(dbRef).then(querySnapshot => {
                            if (querySnapshot.empty) {
                                if (!toast.isActive(toastId)) {
                                    toast.show({
                                        id: toastId,
                                        title: 'No such user',
                                    })
                                }
                                return
                            } else {
                                querySnapshot.forEach(doc => {
                                    updateDoc(doc.ref, {
                                        photoURL: downloadURL,
                                    }).then(() => {
                                        resolve()
                                    }).catch(() => {
                                        reject()
                                    })
                                })

                            }
                        })
                    })
                }
            )
        })
    }

    return {
        avatar,
        loading,
        progress,
        uploadAvatar,
    }
}

export { useAvatar }

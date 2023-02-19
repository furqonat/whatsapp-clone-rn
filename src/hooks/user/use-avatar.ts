import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { useToast } from 'native-base'
import { useEffect, useState } from 'react'

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
            // const dbRef = query(collection(db, 'users'), where('uid', '==', uid))
            // onSnapshot(dbRef, querySnapshot => {
            //     if (querySnapshot.empty) {
            //         setLoading(false)
            //     } else {
            //         querySnapshot.forEach(doc => {
            //             setAvatar(doc.data().photoURL)
            //         })
            //         setLoading(false)
            //     }
            // })
            firestore()
                .collection('users')
                .where('uid', '==', uid)
                .onSnapshot(querySnapshot => {
                    if (querySnapshot.empty) {
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
            // const storageRef = ref(storage, `${uid}/avatar/${file.name}`)
            /*const task = uploadBytesResumable(storageRef, file)
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
                                reject(new Error('User not found'))
                            } else {
                                querySnapshot.forEach(doc => {
                                    updateDoc(doc.ref, {
                                        photoURL: downloadURL,
                                    })
                                        .then(() => {
                                            resolve()
                                        })
                                        .catch(error => {
                                            reject(error)
                                        })
                                })
                            }
                        })
                    })
                }
            )*/
            const reference = storage().ref(`${uid}/avatar/${file.name}`)
            const task = reference.put(file)
            task.on('state_changed', snapshot => {
                setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            })
            task.then(() => {
                reference.getDownloadURL().then(downloadURL => {
                    setAvatar(downloadURL)
                    firestore()
                        .collection('users')
                        .where('uid', '==', uid)
                        .get()
                        .then(querySnapshot => {
                            if (querySnapshot.empty) {
                                reject(new Error('User not found'))
                            } else {
                                querySnapshot.forEach(doc => {
                                    doc.ref
                                        .update({
                                            photoURL: downloadURL,
                                        })
                                        .then(() => {
                                            resolve()
                                        })
                                        .catch(error => {
                                            reject(error)
                                        })
                                })
                            }
                        })
                })
            })
        }).catch(() => {
            if (!toast.isActive(toastId)) {
                toast.show({
                    id: toastId,
                    title: 'Error while uploading a avatar',
                })
            }
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

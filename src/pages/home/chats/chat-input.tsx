import { Entypo, Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { FC, useState } from 'react'
import { TextInput, View } from 'react-native'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage'
import { IChatItem, IChatMessage, sendMessage, useFirebase } from 'utils'
import { Colors, IconButton } from 'react-native-paper'

interface IChatInputProps {
    user?: IChatItem | null
    id?: string | null
    onSend?: (event: IChatMessage) => void
}

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

const ChatInput: FC<IChatInputProps> = props => {

    const [message, setMessage] = useState('')

    const { user } = useFirebase()

    const onSendCallback = (type: string) => {
        if (props.user && user) {
            props.onSend &&
                props.onSend({
                    message: {
                        text: message,
                        createdAt: new Date().toISOString(),
                    },
                    receiver: {
                        phoneNumber: props.user?.phoneNumber!!,
                        displayName: props.user?.displayName!!,
                        uid: props.user?.uid!!,
                    },
                    sender: {
                        phoneNumber: user?.phoneNumber!!,
                        displayName: user?.displayName!!,
                        uid: user?.uid!!,
                    },

                    id: props.id!!,
                    time: new Date().toISOString(),
                    type: type,
                    read: false,
                    visibility: {
                        [props.user.uid]: true,
                        [user.uid]: true,
                    },
                })
        }
    }

    const handleOnPress = async () => {
        if (message.trim().length > 0) {
            if (props?.user && user) {
                onSendCallback('text')
                sendMessage({
                    message: message,
                    receiver: props.user,
                    user: user,
                    id: props.id!!,
                    lastMessageType: message,
                    type: 'text'
                })
                setMessage('')
            }
        }
    }

    const handleOnpressImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        })
        if (!result.cancelled) {

            await fetch(result.uri)
                .then(response => response.blob())
                .then(blob => {
                    const storage = getStorage()
                    const imageType = blob?.type
                    const imageRef = ref(storage, `${user?.phoneNumber}/${props.id}/${uuidv4()}.${imageType}`)
                    const task = uploadBytesResumable(imageRef, blob)
                    task.on('state_changed', snapshot => {
                    }, error => {
                        
                    }, () => {
                        
                        getDownloadURL(task.snapshot.ref).then(url => {
                            onSendCallback('image')
                            sendMessage({
                                message: url,
                                receiver: props.user!!,
                                user: user!!,
                                id: props.id!!,
                                type: 'image',
                                lastMessageType: 'image',
                            })
                            
                        })
                    })
                })
        }
    }

    return (
        <View
            style={{
                marginBottom: 2,
                flexDirection: 'row',
                justifyContent: 'center'
            }}>
            <View
                style={{
                    width: '100%',
                    height: 'auto',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>

                <TextInput
                    value={message}
                    autoFocus={true}
                    style={{
                        height: 40,
                        padding: 10,
                        backgroundColor:'white',
                        borderRadius:20,
                        width:'70%',
                        maxHeight:200


                    }}
                    onChangeText={setMessage}
                    multiline={true}
                    placeholder={'Ketik pesan'}
                />

                <IconButton
                    icon="camera"
                    color={Colors.deepPurple800}
                    size={23}
                    onPress={handleOnpressImage}
                />

                <IconButton
                    icon="send"
                    color={Colors.deepPurple800}
                    size={23}
                    onPress={handleOnPress}
                />
            </View>
        </View>
    )
}

export { ChatInput }


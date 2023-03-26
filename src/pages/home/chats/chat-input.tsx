import storage from '@react-native-firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import React, { FC, useEffect, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { Colors, IconButton } from 'react-native-paper'
import { EmojiKeyboard } from 'rn-emoji-keyboard'
import { IChatItem, IChatMessage, sendMessage, useFirebase } from 'utils'

interface IChatInputProps {
    user?: IChatItem | null
    id?: string | null
    onSend?: (event: IChatMessage) => void
}

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            // eslint-disable-next-line eqeqeq
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

const ChatInput: FC<IChatInputProps> = props => {
    const [message, setMessage] = useState('')
    const [emoji, setEmoji] = useState(false)
    const textInputRef = useRef<TextInput>(null)

    const { user } = useFirebase()

    const onSendCallback = (type: string) => {
        if (
            props.user?.phoneNumber &&
            user &&
            props.user?.displayName &&
            props.user?.uid &&
            props.id &&
            user?.displayName &&
            user.phoneNumber
        ) {
            props.onSend &&
                props.onSend({
                    message: {
                        text: message,
                        createdAt: new Date().toISOString(),
                    },
                    receiver: {
                        phoneNumber: props.user?.phoneNumber,
                        displayName: props.user?.displayName,
                        uid: props.user?.uid,
                    },
                    sender: {
                        phoneNumber: user?.phoneNumber,
                        displayName: user?.displayName,
                        uid: user?.uid,
                    },

                    id: props.id,
                    time: new Date().toISOString(),
                    type,
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
            if (props?.user && user && props.id) {
                onSendCallback('text')
                sendMessage({
                    message,
                    receiver: props.user,
                    user,
                    id: props.id,
                    lastMessageType: message,
                    type: 'text',
                })
                setMessage('')
            }
        }
    }

    const handleOnPressImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        })
        if (!result.cancelled) {
            await fetch(`${result.uri}`)
                .then(response => response.blob())
                .then(blob => {
                    const imageType = blob?.type
                    /* const storage = getStorage()

                    const imageRef = ref(storage, `${user?.phoneNumber}/${props.id}/${uuidv4()}.${imageType}`)
                    const task = uploadBytesResumable(imageRef, blob)
                    task.on(
                        'state_changed',
                        snapshot => {},
                        error => {},
                        () => {
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
                        }
                    )*/
                    const refs = storage().ref(`${user?.phoneNumber}/${props.id}/${uuidv4()}.${imageType}`)
                    refs.put(blob).then(() => {
                        refs.getDownloadURL().then(url => {
                            onSendCallback('image')
                            if (props?.user && user && props.id) {
                                sendMessage({
                                    message: url,
                                    receiver: props.user,
                                    user,
                                    id: props.id,
                                    type: 'image',
                                    lastMessageType: 'image',
                                })
                            }
                        })
                    })
                })
        }
    }

    useEffect(() => {
        if (emoji) {
            textInputRef.current?.blur()
        } else {
            textInputRef.current?.focus()
        }
    }, [emoji])

    return (
        <View
            style={{
                marginBottom: 2,
                flexDirection: 'column',
                justifyContent: 'center',
                height: emoji ? '50%' : 'auto',
            }}>
            <View
                style={{
                    width: '100%',
                    height: 'auto',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 10,
                    paddingRight: 10,
                }}>
                <IconButton
                    icon='emoticon'
                    color={Colors.deepPurple800}
                    size={23}
                    onPress={() => {
                        setEmoji(!emoji)
                    }}
                />
                <TextInput
                    ref={textInputRef}
                    value={message}
                    autoFocus={true}
                    style={{
                        height: 40,
                        padding: 10,
                        backgroundColor: 'white',
                        borderRadius: 20,
                        width: '70%',
                        maxHeight: 200,
                    }}
                    onChangeText={setMessage}
                    multiline={true}
                    placeholder={'Ketik pesan'}
                />

                <IconButton
                    icon='camera'
                    color={Colors.deepPurple800}
                    size={23}
                    onPress={handleOnPressImage}
                />

                <IconButton
                    icon='send'
                    color={Colors.deepPurple800}
                    size={23}
                    onPress={handleOnPress}
                />
            </View>
            {emoji ? (
                <EmojiKeyboard
                    onEmojiSelected={em => {
                        setMessage(prevState => prevState + em.emoji)
                    }}
                />
            ) : null}
        </View>
    )
}

export { ChatInput }

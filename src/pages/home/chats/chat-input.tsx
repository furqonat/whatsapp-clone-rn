import { Entypo, Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Box, IconButton, Stack } from 'native-base'
import React, { FC, useState } from 'react'
import { TextInput } from 'react-native'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage'
import { IChatItem, IChatMessage, sendMessage, useFirebase } from 'utils'

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
            const blob = await fetch(result.uri)

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
        <Stack
            space={3}
            mb={2}
            direction={'row'}
            justifyContent={'center'}>
            <Stack
                w={'100%'}
                h={'auto'}
                px={2}
                borderRadius={'18'}
                maxHeight={'32'}
                justifyContent={'center'}
                direction={'row'}>
                <Box
                    flex={1}
                    justifyContent={'center'}
                    px={4}
                    background={'white'}
                    borderRadius={'18'}
                    maxHeight={'32'}>
                    <TextInput
                        value={message}
                        autoFocus={true}
                        style={{
                            width: '100%',
                        }}
                        onChangeText={setMessage}
                        multiline={true}
                        placeholder={'Ketik pesan'}
                    />
                </Box>
                <IconButton
                    onPress={handleOnpressImage}
                    borderRadius={'full'}
                    _icon={{
                        as: Entypo,
                        name: 'camera',
                        color: '#5b21b6',
                        size: '5',
                    }}
                />

                <IconButton
                    onPress={handleOnPress}
                    borderRadius={'full'}
                    _icon={{
                        as: Ionicons,
                        name: 'send',
                        color: '#5b21b6',
                        size: '6',
                    }}
                />
            </Stack>
        </Stack>
    )
}

export { ChatInput }


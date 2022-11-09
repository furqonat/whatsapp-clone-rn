
import { Entypo, Fontisto, Ionicons } from "@expo/vector-icons";
import { Box, IconButton, Stack } from 'native-base';
import React, { FC, useState } from 'react';
import { TextInput } from 'react-native';
import { IChatItem, IChatMessage, sendMessage, useFirebase } from 'utils';



interface IChatInputProps {
    user?: IChatItem | null,
    id?: string | null,
    onSend?: (event: IChatMessage) => void
}

const ChatInput: FC<IChatInputProps> = (props) => {
    const [message, setMessage] = useState('')

    const { user } = useFirebase()

    const handleOnPress = () => {
        if (message.trim().length > 0) {

            if (props?.user && user) {
                props.onSend && props.onSend({
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
                    type: "text",
                    read: false,
                    visibility: {
                        [props.user.uid]: true,
                        [user.uid]: true
                    }
                })
                sendMessage({
                    message: message,
                    receiver: props.user,
                    user: user,
                    id: props.id!!
                })
                setMessage('')

            }
        }

    }

    return (
        <Stack
            space={3}
            mb={2}
            direction={"row"}
            justifyContent={'center'}>
            <Stack
                w={'100%'}
                h={'auto'}
                px={2}
                borderRadius={'18'}
                maxHeight={'32'}
                justifyContent={'center'}
                direction={"row"}>
                <Box
                    flex={1}
                    justifyContent={'center'}
                    px={4}
                    background={'white'}
                    borderRadius={'18'}
                    maxHeight={'32'} >
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
                    borderRadius={'full'}
                    _icon={{
                        as: Entypo,
                        name: "camera",
                        color: '#5b21b6',
                        size: '5'
                    }} />

                {
                    message.length > 0 ? (
                        <IconButton
                            onPress={handleOnPress}
                            borderRadius={'full'}
                            _icon={{
                                as: Ionicons,
                                name: "send",
                                color: '#5b21b6',
                                size: '6'
                            }} />
                    ) :
                        <IconButton
                            borderRadius={'full'}
                            _icon={{
                                as: Fontisto,
                                name: "mic",
                                color: '#5b21b6',
                                size: '6'
                            }} />
                }
            </Stack>

        </Stack>
    )
}

export { ChatInput };



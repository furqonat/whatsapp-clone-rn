
import React, { FC, useState, } from 'react'
import { Box, IconButton, Input, Stack, TextArea } from 'native-base'
import { Entypo, Ionicons, Fontisto } from "@expo/vector-icons";
import { db, IChatItem, useFirebase } from 'utils';
import { addDoc, doc, setDoc } from '@firebase/firestore';
import { collection, updateDoc } from 'firebase/firestore';
import { TextInput } from 'react-native';



interface IChatInputProps {
    user: IChatItem,
}

const ChatInput: FC<IChatInputProps> = (props) => {
    const [message, setMessage] = useState('')



    const { user } = useFirebase()
    







    return (
        <Stack
            space={3}
            mb={2}
            direction={"row"}
            justifyContent={'center'}>
            <Stack

                w={310} h={'auto'} p={'0.5'}
                borderRadius={'18'}
                maxHeight={'32'}
                justifyContent={'center'}
                backgroundColor={'white'}
                direction={"row"}>

                <TextInput
                    
                    autoFocus={true}
                    style={{ width: 250, left: 5 }}
                    onChangeText={setMessage}
                    multiline={true}


                    placeholder={'Ketik pesan'}
                />
                <IconButton
                    borderRadius={'full'}
                    _icon={{
                        as: Entypo,
                        name: "camera",
                        color: 'grey',
                        size: '5'
                    }} />

            </Stack>
            {
                message.length > 0 ? (
                    <IconButton
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
    )
}

export { ChatInput }



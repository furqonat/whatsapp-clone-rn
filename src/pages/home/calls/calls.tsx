import { IconButton, Menu, Pressable, Stack, StatusBar, Text } from "native-base"
import { Ionicons } from '@expo/vector-icons'
import { RootStackParamList } from "pages/screens"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { ICall, useFirebase } from "utils"
import { useState } from "react"
import { useCall } from "hooks"
import { CallList } from "./call-list"

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin'>
const Calls = () => {
    const navigation = useNavigation<signInScreenProp>()

    const { logout, user } = useFirebase()
    const { calls } = useCall({
        user: user
    })



    const handleClose = () => {
        logout().then(_ => {
            navigation.navigate('signin')
        })
    }
    return (
        <Stack direction={'column'}>
            <StatusBar backgroundColor={'#5b21b6'} />
            <Stack
                display={'flex'}
                flexDirection={'column'}
                h={'100%'}>
                <Stack
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    width={'100%'}
                    p={4}
                    shadow={2}
                    backgroundColor={'violet.800'}
                    direction={'row'}>
                    <Stack>
                        <Text
                            color={'white'}
                            fontSize={20}
                            bold={true}>
                            Transaksi
                        </Text>
                    </Stack>

                    <Stack
                        left={3}
                        justifyItems={'center'}
                        direction={'row'}
                        space={1}>
                        <Menu
                            backgroundColor='white'
                            shadow={2}
                            trigger={triggerProps => {
                                return (
                                    <Pressable accessibilityLabel='More options menu'>
                                        <IconButton
                                            {...triggerProps}
                                            borderRadius='full'
                                            _icon={{
                                                as: Ionicons,
                                                name: 'ellipsis-vertical',
                                                color: 'white',
                                                size: '5',
                                            }}
                                        />
                                    </Pressable>
                                )
                            }}>
                            <Menu.Item
                                onPress={handleClose}>
                                <Text>Keluar</Text>
                            </Menu.Item>
                        </Menu>
                    </Stack>
                </Stack>
                <CallList calls={calls} />
            </Stack>
        </Stack>
    )
}


export { Calls }
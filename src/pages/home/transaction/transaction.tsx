import { Ionicons } from '@expo/vector-icons'
import BottomSheet from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useContacts } from 'hooks'
import { IconButton, Menu, Pressable, Stack, StatusBar, Text } from "native-base"
import { RootStackParamList } from "pages/screens"
import { useMemo, useRef } from "react"
import { useFirebase } from "utils"

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin'>

const Transaction = () => {

    const navigation = useNavigation<signInScreenProp>()

    const { logout, user } = useFirebase()
    const { contacts } = useContacts({
        user: user
    })

    const bsRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], [])


    const handleClose = () => {
        logout().then(_ => {
            navigation.navigate('signin')
        })
    }

    const handleOpen = () => {
        bsRef.current?.expand()
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
                    p={5}
                    shadow={2}
                    backgroundColor={'violet.800'}
                    direction={'row'}>
                    <Stack>
                        <Text
                            color={'white'}
                            fontSize={20}
                            bold={true}>
                            Rekberin
                        </Text>
                    </Stack>

                    <Stack
                        left={3}
                        justifyItems={'center'}
                        direction={'row'}
                        space={1}>
                        <IconButton
                            borderRadius='full'
                            onPress={handleOpen}
                            _icon={{
                                as: Ionicons,
                                name: 'add-outline',
                                color: 'white',
                                size: '5',
                            }} />
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
                            <Menu.Item>
                                <Text>Keluar</Text>
                            </Menu.Item>
                        </Menu>
                    </Stack>
                </Stack>
                <BottomSheet
                    index={-1}
                    animateOnMount={true}
                    enablePanDownToClose={true}
                    ref={bsRef}
                    snapPoints={snapPoints}>
                    
                </BottomSheet>
            </Stack>
        </Stack>
    )
}

export { Transaction }

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useAvatar } from 'hooks'
import { HStack, Icon, Image, Text, VStack } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ActivityIndicator, Button, Dialog } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { USER_KEY, useFirebase } from 'utils'
import { useAppDispatch } from 'utils/context'
import { setUser } from 'utils/context/users'

type RefStack = StackNavigationProp<RootStackParamList, 'profile_publik' | 'tentang_kami' | 'profile_diri' | 'privasi'>

const Profile = () => {
    const navigation = useNavigation<RefStack>()
    const { setValue, logout } = useFirebase()
    const [loading, setLoading] = useState(false)
    const [dialog, setDialog] = useState(false)
    const dispatch = useAppDispatch()

    const handlePublik = () => {
        navigation.navigate('profile_publik')
    }

    const handleDiri = () => {
        navigation.navigate('profile_diri')
    }

    const handleTentangKami = () => {
        navigation.navigate('tentang_kami')
    }

    const handlePrivasi = () => {
        navigation.navigate('privasi')
    }

    const handleLogout = () => {
        setLoading(true)
        setDialog(false)
        setValue(USER_KEY, JSON.stringify('no'))
            .then(_ => {
                logout().then(() => {
                    dispatch(setUser('no'))
                    navigation.navigate('signin')
                    setLoading(false)
                })
            })
            .catch(error => {
                alert(error.message)
                setLoading(false)
            })
    }

    const { user } = useFirebase()

    const { avatar } = useAvatar({
        uid: user?.uid,
    })

    const [displayName, setDisplayName] = useState('')

    useEffect(() => {
        if (user) {
            setDisplayName(user?.displayName || '')
        }
    }, [user])

    return (
        <VStack h={'100%'}>
            <HStack
                background={'violet.800'}
                maxHeight={'200px'}>
                <HStack
                    alignItems={'center'}
                    space={2}
                    padding={3}>
                    <Image
                        src={avatar}
                        width={'50px'}
                        alt={'avatar of me'}
                        height={'50px'}
                        borderRadius={'full'}
                    />
                    <VStack>
                        <Text
                            fontSize={'20px'}
                            fontWeight={'bold'}
                            color={'white'}>
                            {displayName}
                        </Text>
                        <Text
                            fontSize={'xs'}
                            color={'white'}>
                            {user?.phoneNumber}
                        </Text>
                    </VStack>
                </HStack>
            </HStack>
            <VStack
                space={2}
                padding={5}>
                <Text
                    fontWeight={'semibold'}
                    fontSize={'20px'}>
                    Pengaturan
                </Text>
                <TouchableOpacity onPress={handlePublik}>
                    <HStack
                        alignItems={'center'}
                        space={2}>
                        <Icon
                            as={<MaterialCommunityIcons name='account' />}
                            size={'2xl'}
                            name={'person'}
                        />

                        <Text fontWeight={'bold'}>Publik profil</Text>
                    </HStack>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDiri}>
                    <HStack
                        alignItems={'center'}
                        space={2}>
                        <Icon
                            as={<MaterialCommunityIcons name='account-check' />}
                            size={'2xl'}
                            name={'person'}
                        />

                        <Text fontWeight={'bold'}>Data diri</Text>
                    </HStack>
                </TouchableOpacity>
                <Text
                    fontWeight={'semibold'}
                    fontSize={'20px'}>
                    Privasi
                </Text>
                <TouchableOpacity onPress={handleTentangKami}>
                    <HStack
                        alignItems={'center'}
                        space={2}>
                        <Icon
                            as={<MaterialCommunityIcons name='information' />}
                            size={'2xl'}
                            name={'person'}
                        />

                        <Text fontWeight={'bold'}>Tentang Kami</Text>
                    </HStack>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePrivasi}>
                    <HStack
                        alignItems={'center'}
                        space={2}>
                        <Icon
                            as={<MaterialCommunityIcons name='help' />}
                            size={'2xl'}
                            name={'person'}
                        />

                        <Text fontWeight={'bold'}>Privasi</Text>
                    </HStack>
                </TouchableOpacity>
                <Text
                    fontWeight={'semibold'}
                    fontSize={'20px'}>
                    Lainnya
                </Text>
                <TouchableOpacity onPress={() => setDialog(true)}>
                    <HStack
                        alignItems={'center'}
                        space={2}>
                        <Icon
                            as={<MaterialCommunityIcons name='exit-to-app' />}
                            size={'2xl'}
                            name={'person'}
                        />

                        <Text fontWeight={'bold'}>Keluar</Text>
                    </HStack>
                </TouchableOpacity>
            </VStack>
            <Dialog visible={dialog}>
                <Dialog.Title>
                    <Text>Apakah kamu yakin ingin keluar dari aplikasi</Text>
                </Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={handleLogout}>Ok</Button>
                    <Button onPress={() => setDialog(false)}>Batal</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog visible={loading}>
                <Dialog.Content>
                    <ActivityIndicator />
                </Dialog.Content>
            </Dialog>
        </VStack>
    )
}

export { Profile }

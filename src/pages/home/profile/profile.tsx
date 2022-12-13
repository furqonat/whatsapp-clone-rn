import { useAvatar } from 'hooks'
import { HStack, Icon, IconButton, Image, Text, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useFirebase } from 'utils'

const Profile = () => {

    const { user } = useFirebase()

    const { avatar } = useAvatar({
        phoneNumber: user?.phoneNumber
    })

    const [displayName, setDisplayName] = useState("")

    useEffect(() => {
        if (user) {
            setDisplayName(user?.displayName || "")
        }
    }, [user])


    return (
        <VStack>
            <HStack
                background={'violet.800'}
                maxHeight={'200px'}>
                <HStack
                    alignItems={'center'}
                    space={2}
                    padding={'5'}>
                    <Image
                        src={avatar}
                        width={'50px'}
                        alt={'avatar of me'}
                        height={'50px'}
                        borderRadius={'full'} />
                    <VStack
                        space={1}>
                        <Text
                            fontSize={'20px'}
                            fontWeight={'bold'}
                            color={'white'}>
                            {displayName}
                        </Text>
                        <Text
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
                <TouchableOpacity>
                    <HStack
                        alignItems={'center'}
                        space={2}>

                        <Icon
                            as={
                                <MaterialCommunityIcons
                                    name='account'
                                />
                            }
                            size={'2xl'}
                            name={'person'} />

                        <Text
                            fontWeight={'bold'}>
                            Publik profil
                        </Text>
                    </HStack>
                </TouchableOpacity>
                <TouchableOpacity>
                    <HStack
                        alignItems={'center'}
                        space={2}>

                        <Icon
                            as={
                                <MaterialCommunityIcons
                                    name='account-check'
                                />
                            }
                            size={'2xl'}
                            name={'person'} />

                        <Text
                            fontWeight={'bold'}>
                            Data diri
                        </Text>
                    </HStack>
                </TouchableOpacity>
                <Text
                    fontWeight={'semibold'}
                    fontSize={'20px'}>
                    Privasi
                </Text>
                <TouchableOpacity>
                    <HStack
                        alignItems={'center'}
                        space={2}>

                        <Icon
                            as={
                                <MaterialCommunityIcons
                                    name='information'
                                />
                            }
                            size={'2xl'}
                            name={'person'} />

                        <Text
                            fontWeight={'bold'}>
                            Tentang Kami
                        </Text>
                    </HStack>
                </TouchableOpacity>
                <TouchableOpacity>
                    <HStack
                        alignItems={'center'}
                        space={2}>

                        <Icon
                            as={
                                <MaterialCommunityIcons
                                    name='help'
                                />
                            }
                            size={'2xl'}
                            name={'person'} />

                        <Text
                            fontWeight={'bold'}>
                            Privasi
                        </Text>
                    </HStack>
                </TouchableOpacity>
            </VStack>
        </VStack>
    )
}

export { Profile }

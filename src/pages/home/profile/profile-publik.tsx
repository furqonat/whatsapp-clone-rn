import React, { useEffect, useState } from 'react'
import { View, Text, StatusBar, Image, TextInput, TouchableOpacity } from 'react-native'
import { IconButton, useToast } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useAvatar, useUserInfo } from 'hooks'
import { db, useFirebase } from 'utils'
import { ButtonPrimary, InputPrimary } from 'components'
import { doc, updateDoc } from 'firebase/firestore'
import * as ImagePicker from 'expo-image-picker'

const ProfilePublik = () => {
    const navigation = useNavigation()

    const handleBack = () => {
        navigation.goBack()
    }

    const toast = useToast()


    const { user, reloadUser } = useFirebase()

    const { userInfo } = useUserInfo({
        phoneNumber: `${user?.phoneNumber}`
    })

    const { uploadAvatar } = useAvatar({
        phoneNumber: user?.phoneNumber,
    })

    const [displayName, setDisplayName] = useState<string | null | undefined>('')
    const [email, setEmail] = useState<string | null | undefined>('')

    useEffect(() => {
        if (userInfo?.displayName && userInfo?.phoneNumber && userInfo?.email) {
            setDisplayName(user?.displayName)
            setEmail(user?.email)
        }
    }, [userInfo?.displayName, userInfo?.email])

    const handleSave = () => {
        if (user?.phoneNumber) {
            const userRef = doc(db, 'users', user?.phoneNumber)
            updateDoc(userRef, {
                displayName: displayName,
                email: email,
            })
        }
    }

    const handleChangeAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (result.cancelled) {
            const toastId = 'cancel'
            if (!toast.isActive(toastId)) {
                toast.show({
                    id: toastId,
                    title: 'Get images canceled',
                })
                return
            }
        } else {
            // convert uri into file
            const file = await fetch(result.uri)
                .then(res => res.blob())
                .then(blob => new File([blob], `${Date.now()}.png`, { type: 'image/png' }))
            uploadAvatar(file).then(() => {
                reloadUser()
            })

        }
    }


    return (
        <View
            style={{
                height: '100%',
                flexDirection: 'column'
            }}>
            <StatusBar animated={true} backgroundColor={'#5b21b6'} />
            <View
                style={{
                    zIndex: 1,
                    height: 60,
                    display: 'flex',
                    backgroundColor: '#5b21b6',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 10
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        right: 10,

                    }}>

                    <IconButton
                        onPress={handleBack}
                        borderRadius='full'
                        _icon={{
                            as: Ionicons,
                            name: 'arrow-back-outline',
                            color: 'white',
                            size: '6',
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white'
                        }}>
                        Publik profile
                    </Text>
                </View>
            </View>
            <View style={{
                marginTop: 20,
                display: 'flex',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    onPress={handleChangeAvatar}>
                    <Image
                        style={{
                            width: 150,
                            height: 150,
                            borderRadius: 100,
                            marginRight: 10
                        }} source={{ uri: userInfo?.photoURL ? userInfo?.photoURL : undefined }} />
                    <View style={{
                        position: 'absolute',
                        left: 110,
                        top: 100,

                        borderRadius: 50,
                        backgroundColor: 'white'

                    }}>
                        <IconButton

                            // onPress={handleBack}
                            borderRadius='full'
                            _icon={{
                                as: Ionicons,
                                name: 'camera',
                                color: 'green.400',
                                size: '6',
                            }}
                        />
                    </View>

                </TouchableOpacity>


                <View style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    alignContent: 'center',
                }}>
                    <InputPrimary
                        title={'Nama'}
                        placeholder={'Masukan Nama anda'}
                        onChangeText={(text: any) => setDisplayName(text)}
                        value={displayName} />
                    <InputPrimary
                        title={'Email'}
                        value={email}
                        onChangeText={(text: any) => setEmail(text)}
                        placeholder={'Masukan Email Anda'} />
                    <InputPrimary title={'No Telpon'}
                        disabled={true}
                        value={user?.phoneNumber} />
                    <ButtonPrimary
                        onPress={handleSave}
                        title={'Save'}
                        px={12}
                        py={'35%'} />

                </View>

            </View>
        </View>
    )
}

export { ProfilePublik }
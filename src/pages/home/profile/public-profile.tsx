import { Ionicons } from '@expo/vector-icons'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { InputPrimary } from 'components'
import * as ImagePicker from 'expo-image-picker'
import { useAvatar, useUserInfo } from 'hooks'
import { IconButton, useToast } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import phone from 'phone'
import React, { useEffect, useState } from 'react'
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { Button } from 'react-native-paper'
import { useFirebase } from 'utils'

type Props = StackNavigationProp<RootStackParamList>

const PublicProfile = () => {
    const navigation = useNavigation<Props>()

    const handleBack = () => {
        navigation.goBack()
    }

    const toast = useToast()

    const { user, reloadUser } = useFirebase()

    const { userInfo } = useUserInfo({
        uid: user?.uid,
    })

    const { uploadAvatar } = useAvatar({
        uid: user?.uid,
    })

    const [email, setEmail] = useState<string | null | undefined>('')
    const [displayName, setDisplayName] = useState<string | null | undefined>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setDisplayName(userInfo?.displayName)
        setEmail(userInfo?.email)
        setPhoneNumber(userInfo?.phoneNumber || '')
    }, [userInfo?.displayName, userInfo?.email])

    const handleSave = () => {
        setLoading(true)
        /*const userRef = query(collection(db, 'users'), where('uid', '==', `${user?.uid}`))
        onSnapshot(userRef, querySnapshot => {
            if (querySnapshot.empty) {
                toast.show({
                    title: 'No matching User',
                })
                setLoading(false)
                return
            } else {
                querySnapshot.forEach(doc => {
                    updateDoc(doc.ref, {
                        displayName: displayName,
                        email: email,
                    }).then(() => {
                        const ph = phone(phoneNumber, {
                            country: 'ID',
                        })
                        setLoading(false)
                        navigation.navigate('change_phone', {
                            new_phone: ph.phoneNumber || phoneNumber,
                        })
                    })
                })
            }
        })*/
        if (user?.phoneNumber) {
            firestore()
                .collection('users')
                .where('phoneNumber', '==', user?.phoneNumber)
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        toast.show({
                            title: 'No matching User',
                        })
                        setLoading(false)
                        return
                    } else {
                        querySnapshot.forEach(doc => {
                            doc.ref
                                .update({
                                    displayName,
                                    email,
                                })
                                .then(() => {
                                    const ph = phone(phoneNumber, {
                                        country: 'ID',
                                    })
                                    setLoading(false)
                                    navigation.navigate('change_phone', {
                                        new_phone: ph.phoneNumber || phoneNumber,
                                    })
                                })
                        })
                    }
                })
        } else {
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
                flexDirection: 'column',
            }}>
            <StatusBar
                animated={true}
                backgroundColor={'#5b21b6'}
            />
            <View
                style={{
                    zIndex: 1,
                    height: 60,
                    display: 'flex',
                    backgroundColor: '#5b21b6',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 10,
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
                            color: 'white',
                        }}>
                        Publik profile
                    </Text>
                </View>
            </View>
            <View
                style={{
                    marginTop: 20,
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <TouchableOpacity onPress={handleChangeAvatar}>
                    <Image
                        style={{
                            width: 150,
                            height: 150,
                            borderRadius: 100,
                            marginRight: 10,
                        }}
                        source={{ uri: userInfo?.photoURL ? userInfo?.photoURL : undefined }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            left: 110,
                            top: 100,

                            borderRadius: 50,
                            backgroundColor: 'white',
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

                <View
                    style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        alignContent: 'center',
                    }}>
                    <InputPrimary
                        title={'Nama'}
                        placeholder={'Masukan Nama anda'}
                        onChangeText={(text: any) => setDisplayName(text)}
                        value={displayName}
                    />
                    <InputPrimary
                        title={'Email'}
                        value={email}
                        onChangeText={(text: any) => setEmail(text)}
                        placeholder={'Masukan Email Anda'}
                    />
                    <InputPrimary
                        keyboardType='numeric'
                        title={'No Telpon'}
                        placeholder={'Masukan No Telpon Anda'}
                        onChangeText={(text: any) => {
                            setPhoneNumber(text)
                        }}
                        value={phoneNumber}
                    />
                    <Button
                        disabled={loading}
                        loading={loading}
                        mode={'contained'}
                        onPress={handleSave}>
                        Simpan
                    </Button>
                </View>
            </View>
        </View>
    )
}

export { PublicProfile }

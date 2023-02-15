import { collection, doc, onSnapshot, query, updateDoc, where } from '@firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import * as ImagePicker from 'expo-image-picker'
import { useAvatar } from 'hooks'
import { Center, Input, Stack, VStack, useToast } from 'native-base'
import { Button } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { IconButton } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { USER_KEY, db, useFirebase } from 'utils'
import { RootStackParamList } from '../screens'
import { Image } from 'react-native'
import { setValue } from 'lib'

type tabScreenProp = StackNavigationProp<RootStackParamList, 'tabbar'>

function Form() {
    const navigation = useNavigation<tabScreenProp>()
    const toast = useToast()

    const { user } = useFirebase()
    const [displayName, setDisplayName] = useState(user?.displayName || '')
    const { uploadAvatar, avatar } = useAvatar({
        uid: user?.uid,
    })
    const [photo, setPhoto] = useState('')
    const [loading, setLoading] = useState(false)


    const handlePress = () => {
        if (displayName?.length > 0) {
            setLoading(true)
            const queryRef = query(collection(db, 'users'), where('uid', '==', `${user?.uid}`))
            onSnapshot(queryRef, (querySnapshot) => {
                if (querySnapshot.empty) {
                    toast.show({
                        title: 'No matching User',
                    })
                    setLoading(false)
                    return
                } else {
                    querySnapshot.forEach((doc) => {
                        updateDoc(doc.ref, {
                            displayName: displayName,
                        }).then(() => {
                            setLoading(false)
                            setValue(USER_KEY, JSON.stringify({
                                ...user,
                            }))
                            navigation.navigate('tabbar')
                        }).catch(error => {
                            setLoading(false)
                            toast.show({
                                title: error.message,
                            })
                        })
                    })
                }
            })
        }
    }

    const handleChangeDisplayName = (value: string) => {
        setDisplayName(value)
    }

    useEffect(() => {
        if (avatar) {
            setPhoto(avatar)
        }
    }, [avatar])


    const handleNewAvatar = async () => {
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
            setPhoto(result.uri)
            // convert uri into file
            const file = await fetch(result.uri)
                .then(res => res.blob())
                .then(blob => new File([blob], `${Date.now()}.png`, { type: 'image/png' }))
            uploadAvatar(file)
        }
    }

    return (
        <SafeAreaView>
            <VStack
                alignItems='center'
                space={4}
                height={'100%'}
                px='3'>
                <Center
                    mt='20'
                    size='40'>
                    <Image
                        style={{
                            backgroundColor: '#ccc',
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                        }}
                        source={{ uri: photo }}
                    />
                    <IconButton
                        style={{
                            position: 'absolute',
                            backgroundColor: 'white',
                            padding: 4,
                            bottom: 20,
                            right: 40,
                        }}
                        icon='camera'
                        size={24}
                        onPress={handleNewAvatar}
                    />
                </Center>
                <Stack
                    space={4}
                    direction={'column'}
                    width={'100%'}>
                    <Input
                        onChangeText={handleChangeDisplayName}
                        value={displayName}
                        placeholder='Input Your Name'
                    />

                    <Button
                        loading={loading}
                        mode='contained'
                        disabled={displayName.length <= 0 || loading}
                        onPress={handlePress}>
                        Selesai
                    </Button>
                </Stack>
            </VStack>
        </SafeAreaView>
    )
}

export { Form }

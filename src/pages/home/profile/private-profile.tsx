import { Ionicons } from '@expo/vector-icons'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { useNavigation } from '@react-navigation/native'
import { ButtonPrimary, InputPrimary } from 'components'
import * as ImagePicker from 'expo-image-picker'
import moment from 'moment'
import { IconButton } from 'native-base'
import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native'
import { useFirebase } from 'utils'
import { Button, Dialog } from 'react-native-paper'

interface Verification {
    image: string
    address: string
    name: string
    nik: string
    dob?: string
    date?: string
    bankName?: string
    bankAccount?: string
    bankAccountName?: string
}

const useVerification = (props: { phoneNumber?: string | null | undefined }) => {
    const [verification, setVerification] = useState<Verification | null>(null)

    useEffect(() => {
        if (props?.phoneNumber) {
            firestore()
                .collection('users')
                .where('phoneNumber', '==', props?.phoneNumber)
                .get()
                .then(querySnapshot => {
                    querySnapshot.docs.forEach(documentSnapshot => {
                        if (props.phoneNumber && documentSnapshot.exists) {
                            documentSnapshot.ref
                                .collection('verification')
                                .doc(props.phoneNumber)
                                .get()
                                .then(querySnapshot => {
                                    if (querySnapshot.exists) {
                                        setVerification(querySnapshot.data() as Verification)
                                    }
                                })
                                .catch(error => {
                                    alert(error)
                                })
                        } else {
                            alert('User not found')
                        }
                    })
                })
        } else {
            return () => {}
        }
    }, [props?.phoneNumber])

    return { verification }
}

const PrivateProfile = () => {
    const navigation = useNavigation()
    const [dialog, setDialog] = useState(false)

    const handleBack = () => {
        navigation.goBack()
    }

    const [imageFile, setImageFile] = useState<File | null | undefined>(null)
    const [image, setImage] = useState<string | null | undefined>(null)
    const [address, setAddress] = useState<string | null | undefined>(null)
    const [name, setName] = useState<string | null | undefined>(null)
    const [nik, setNik] = useState<string | null | undefined>(null)
    const [dob, setDob] = useState<string | null | undefined>(null)
    const [date, setDate] = useState<string | null | undefined>(null)
    const [bankName, setBankName] = useState<string | null | undefined>(null)
    const [bankAccount, setBankAccount] = useState<string | null | undefined>(null)
    const [bankAccountName, setBankAccountName] = useState<string | null | undefined>(null)

    const { user } = useFirebase()

    const { verification } = useVerification({
        phoneNumber: user?.phoneNumber,
    })

    useEffect(() => {
        if (verification) {
            setImage(verification.image)
            setAddress(verification.address)
            setName(verification.name)
            setNik(verification.nik)
            setDob(verification.dob)
            setDate(verification.date)
            setBankName(verification.bankName)
            setBankAccount(verification.bankAccount)
            setBankAccountName(verification.bankAccountName)
        }
    }, [verification])

    const handleChangeDate = (event: any, selectedDate: any) => {
        const date = moment(selectedDate).format('DD-MM-YYYY')
        setDob(date)
    }

    const handleOpenImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        })

        if (!result.cancelled) {
            setImage(result.uri)
            const file = await fetch(`${result.uri}`)
                .then(res => res.blob())
                .then(blob => new File([blob], `${Date.now()}.png`, { type: 'image/png' }))
            setImageFile(file)
        }
    }

    const handleOpenDatePicker = () => {
        DateTimePickerAndroid.open({
            mode: 'date',
            value: new Date(`${dob}`),
            onChange: handleChangeDate,
        })
    }

    const handleSave = () => {
        if (user?.phoneNumber) {
            setDialog(true)
            const st = storage().ref(`users/${user?.phoneNumber}/id-card`)
            firestore()
                .collection('users')
                .where('phoneNumber', '==', user?.phoneNumber)
                .get()
                .then(querySnapshot => {
                    querySnapshot.docs.map(documentSnapshot => {
                        if (user.phoneNumber && documentSnapshot.exists) {
                            return documentSnapshot.ref
                                .collection('verification')
                                .doc(user.phoneNumber)
                                .set({
                                    address,
                                    name,
                                    nik,
                                    dob,
                                    date,
                                    bankName,
                                    bankAccount,
                                    bankAccountName,
                                })
                                .then(() => {
                                    if (imageFile) {
                                        st.put(imageFile).then(() => {
                                            st.getDownloadURL().then(url => {
                                                if (user.phoneNumber && documentSnapshot.exists) {
                                                    documentSnapshot.ref
                                                        .collection('verification')
                                                        .doc(user.phoneNumber)
                                                        .set(
                                                            {
                                                                image: url,
                                                            },
                                                            { merge: true }
                                                        )
                                                        .then(() => {
                                                            handleBack()
                                                            setDialog(false)
                                                        })
                                                        .catch(error => {
                                                            setDialog(false)
                                                            ToastAndroid.show(error, ToastAndroid.SHORT)
                                                        })
                                                }
                                            })
                                        })
                                    } else {
                                        setDialog(false)
                                        handleBack()
                                    }
                                })
                                .catch(error => {
                                    setDialog(false)
                                    ToastAndroid.show(error, ToastAndroid.SHORT)
                                })
                        } else {
                            setDialog(false)
                            ToastAndroid.show('User not found', ToastAndroid.SHORT)
                        }
                    })
                })
        } else {
            ToastAndroid.show('User not found', ToastAndroid.SHORT)
            setDialog(false)
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
                        Data Diri
                    </Text>
                </View>
            </View>
            <ScrollView>
                <View
                    style={{
                        width: '100%',
                        marginBottom: 20,
                    }}>
                    <View
                        style={{
                            marginTop: 20,
                            marginBottom: 10,
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                        <TouchableOpacity onPress={handleOpenImagePicker}>
                            <Image
                                style={{
                                    width: 250,
                                    height: 150,
                                    borderRadius: 10,
                                    marginRight: 10,
                                }}
                                source={{
                                    uri:
                                        image && image?.length > 5
                                            ? image
                                            : 'https://via.placeholder.com/200x200?Text=Foto+KTP',
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            alignContent: 'center',
                        }}>
                        <InputPrimary
                            value={name}
                            onChangeText={setName}
                            title={'Nama Lengkap'}
                            placeholder={'Masukan Nama Anda Sesuai KTP...'}
                        />
                        <InputPrimary
                            value={address}
                            onChangeText={setAddress}
                            title={'Alamat Lengkap'}
                            placeholder={'Masukan Email Anda...'}
                        />
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={handleOpenDatePicker}>
                            <InputPrimary
                                disabled={true}
                                value={dob}
                                onChangeText={setDob}
                                title={'Tanggal Lahir'}
                                placeholder={'Masukan Tanggal Lahir Anda...'}
                            />
                        </TouchableOpacity>
                        <InputPrimary
                            value={nik}
                            onChangeText={setNik}
                            title={'NIK'}
                            placeholder={'Masukan NIK...'}
                        />
                        <InputPrimary
                            value={bankName}
                            onChangeText={setBankName}
                            title={'Nama Bank'}
                            placeholder={'Masukan Nama Bank Anda...'}
                        />
                        <InputPrimary
                            value={bankAccountName}
                            onChangeText={setBankAccountName}
                            title={'An Bank'}
                            placeholder={'Masukan Nama Anda...'}
                        />
                        <InputPrimary
                            value={bankAccount}
                            onChangeText={setBankAccount}
                            title={'No Rekening'}
                            placeholder={'Masukan No Rekening anda'}
                        />
                        {/* <DatePicker
                            iosDisplay="inline"
                            value={new Date(`dob`)}
                            onDateChange={(date: Date | null) => {
                                setDate(date?.toISOString())
                            }}
                            text={`${dob}`} /> */}
                        <Button
                            mode={'contained'}
                            onPress={handleSave}>
                            Simpan
                        </Button>
                    </View>
                </View>
            </ScrollView>
            <Dialog visible={dialog}>
                <Dialog.Content>
                    <View
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <ActivityIndicator
                            size='large'
                            color='#5b21b6'
                        />
                    </View>
                </Dialog.Content>
            </Dialog>
        </View>
    )
}

export { PrivateProfile }
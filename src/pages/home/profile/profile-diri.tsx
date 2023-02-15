import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonPrimary, InputPrimary } from 'components'
import { IconButton } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { db, useFirebase } from 'utils'
import { Ionicons } from '@expo/vector-icons'
import { collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment'
import * as ImagePicker from 'expo-image-picker'



interface Verification {
    image: string,
    address: string,
    name: string,
    nik: string,
    dob?: string,
    date?: string,
    bankName?: string,
    bankAccount?: string,
    bankAccountName?: string,
}

const useVerification = (props: {
    phoneNumber?: string | null | undefined
}) => {

    const [verification, setVerification] = useState<Verification | null>(null)

    useEffect(() => {
        if (props?.phoneNumber) {
            const docRef = doc(db, 'users', props.phoneNumber, 'verification', props.phoneNumber)
            const unsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setVerification(doc.data() as Verification)
                }
            })
            return () => unsubscribe()
        } else {
            return () => { }
        }
    }, [props?.phoneNumber])
    return { verification }
}



const ProfileDiri = () => {

    const navigation = useNavigation()

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
        phoneNumber: user?.phoneNumber
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
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
            const file = await fetch(result.uri)
                .then(res => res.blob())
                .then(blob => new File([blob], `${Date.now()}.png`, { type: 'image/png' }))
            setImageFile(file)
        }
    }

    const handleOpenDatePicker = () => {
        DateTimePickerAndroid.open({
            mode: 'date',
            value: new Date(`${dob}`),
            onChange: handleChangeDate
        })
    }

    const handleSave = () => {
        if (user?.phoneNumber) {
            const storage = getStorage()
            const docRef = query(collection(db, 'users'), where('phoneNumber', '==', user?.phoneNumber))
            getDocs(docRef).then((docData) => {
                if (docData.empty) {
                    console.log('No matching documents.');
                    return;
                } else {
                    docData.forEach((document) => {
                        const docRef = doc(db, 'users', document.id, 'verification', document.id)
                        updateDoc(docRef, {
                            address: address,
                            name: name,
                            nik: nik,
                            dob: dob,
                            date: date,
                            bankName: bankName,
                            bankAccount: bankAccount,
                            bankAccountName: bankAccountName
                        }).then(() => {
                            if (imageFile) {
                                const storageRef = ref(storage, `users/${user?.phoneNumber}/id-card`)
                                uploadBytes(storageRef, imageFile).then(() => {
                                    getDownloadURL(storageRef).then((url) => {
                                        updateDoc(docRef, {
                                            image: url
                                        }).then(() => {
                                        })
                                    })
                                })
                            }
                        })
                    })
                }
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
                        Data Diri
                    </Text>
                </View>
            </View>
            <ScrollView>
                <View style={{
                    width: '100%',
                    marginBottom: 20
                }}>
                    <View style={{
                        marginTop: 20,
                        marginBottom: 10,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity
                            onPress={handleOpenImagePicker}>
                            <Image
                                style={{
                                    width: 250,
                                    height: 150,
                                    borderRadius: 10,
                                    marginRight: 10
                                }} source={{ uri: image && image?.length > 5 ? image : 'https://via.placeholder.com/200x200?Text=Foto+KTP' }} />
                        </TouchableOpacity>
                    </View>


                    <View style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        alignContent: 'center',

                    }}>
                        <InputPrimary
                            value={name}
                            onChangeText={setName}
                            title={'Nama Lengkap'}
                            placeholder={'Masukan Nama Anda Sesuai KTP...'} />
                        <InputPrimary
                            value={address}
                            onChangeText={setAddress}
                            title={'Alamat Lengkap'}
                            placeholder={'Masukan Email Anda...'} />
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
                                placeholder={'Masukan Tanggal Lahir Anda...'} />
                        </TouchableOpacity>
                        <InputPrimary
                            value={nik}
                            onChangeText={setNik}
                            title={'NIK'}
                            placeholder={'Masukan NIK...'} />
                        <InputPrimary
                            value={bankName}
                            onChangeText={setBankName}
                            title={'Nama Bank'}
                            placeholder={'Masukan Nama Bank Anda...'} />
                        <InputPrimary
                            value={bankAccountName}
                            onChangeText={setBankAccountName}
                            title={'An Bank'}
                            placeholder={'Masukan Nama Anda...'} />
                        <InputPrimary
                            value={bankAccount}
                            onChangeText={setBankAccount}
                            title={'No Rekening'}
                            placeholder={'Masukan No Rekening anda'} />
                        {/* <DatePicker
                            iosDisplay="inline"
                            value={new Date(`dob`)}
                            onDateChange={(date: Date | null) => {
                                setDate(date?.toISOString())
                            }}
                            text={`${dob}`} /> */}
                        <ButtonPrimary
                            onPress={handleSave}
                            title={'Save'}
                            px={12} py={'35%'} />

                    </View>
                </View>

            </ScrollView>

        </View >

    )
}

export { ProfileDiri }
import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { ButtonPrimary, InputPrimary } from 'components'
import { IconButton } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { useFirebase } from 'utils'
import { useAvatar } from 'hooks'
import { Ionicons } from '@expo/vector-icons'



const ProfileDiri = () => {

    const navigation = useNavigation()

    const handleBack = () => {
        navigation.goBack()
    }

    const { user } = useFirebase()

    const { avatar } = useAvatar({
        phoneNumber: user?.phoneNumber
    })
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
                    width:'100%',
                    marginBottom:20
                }}>
                    <View style={{
                        marginTop: 20,
                        marginBottom: 10,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity>
                            <Image
                                style={{
                                    width: 250,
                                    height: 150,
                                    borderRadius: 10,
                                    marginRight: 10
                                }} source={{ uri: avatar ? avatar : undefined }} />
                        </TouchableOpacity>
                    </View>


                    <View style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        alignContent: 'center',

                    }}>
                        <InputPrimary tittle={'Nama Lengkap'} placeholder={'Masukan Nama Anda Sesuai KTP...'} />
                        <InputPrimary tittle={'Alamat Lengkap'} placeholder={'Masukan Email Anda...'} />
                        <InputPrimary tittle={'NIK'} placeholder={'Masukan NIK...'} />
                        <InputPrimary tittle={'Nama Bank'} placeholder={'Masukan Nama Bank Anda...'} />
                        <InputPrimary tittle={'An Bank'} placeholder={'Masukan Nama Anda...'} />
                        <InputPrimary tittle={'No Rekening'} placeholder={'Masukan No Rekening anda'} />
                        <ButtonPrimary tittle={'Save'} px={12} py={'35%'} />


                    </View>
                </View>

            </ScrollView>

        </View >

    )
}

export { ProfileDiri }
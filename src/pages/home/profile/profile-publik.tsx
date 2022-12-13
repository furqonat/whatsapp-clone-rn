import React, { useEffect, useState } from 'react'
import { View, Text, StatusBar, Image, TextInput, TouchableOpacity } from 'react-native'
import { IconButton } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useAvatar } from 'hooks'
import { useFirebase } from 'utils'
import { ButtonPrimary, InputPrimary } from 'components'

const ProfilePublik = () => {
    const navigation = useNavigation()

    const handleBack = () => {
        navigation.goBack()
    }

    const { user } = useFirebase()

    const { avatar } = useAvatar({
        phoneNumber: user?.phoneNumber
    })

    const [displayName, setDisplayName] = useState<string | null | undefined>('')

    useEffect(()=>{
        if(user){
            setDisplayName(user?.displayName)
        }
    },[])
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
                marginTop:20,
                display: 'flex',
                alignItems: 'center'
            }}>
                <TouchableOpacity>
                <Image
                    style={{
                        width: 150,
                        height: 150,
                        borderRadius: 100,
                        marginRight: 10
                    }} source={{ uri: avatar ? avatar : undefined }} />
                    <View style={{
                        position:'absolute',
                        left:110,
                        top:100,
                        
                        borderRadius:50,
                        backgroundColor:'white'

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
                    display:'flex',
                    width:'100%',
                    alignItems:'center',
                    alignContent:'center',
                   
                }}>
                    <InputPrimary tittle={'Nama'} placeholder={'Masukan Nama anda'} onChangeText={(text:any) => setDisplayName(text)} value={displayName} />
                    <InputPrimary tittle={'Email'} placeholder={'Masukan Email Anda'} />
                    <InputPrimary tittle={'No Telpon'}  disabled={true} value={user?.phoneNumber} />
                    <ButtonPrimary tittle={'Save'} px={12} py={'35%'}/>
                    
                </View>

            </View>
        </View>
    )
}

export { ProfilePublik }
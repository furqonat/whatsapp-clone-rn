import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { IconButton } from 'native-base'
import React from 'react'
import { StatusBar, Text, View } from 'react-native'

const AboutUs = () => {
    const navigation = useNavigation()

    const handleBack = () => {
        navigation.goBack()
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
                        Tentang Kami
                    </Text>
                </View>
            </View>
            <View
                style={{
                    marginTop: 5,
                    padding: 15,
                }}>
                <Text
                    style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: 'orange',
                        alignSelf: 'center',
                    }}>
                    REKBERIN
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'orange',
                    }}>
                    Tentang Kami
                </Text>
                <Text
                    style={{
                        textAlign: 'justify',
                        marginBottom: 5,
                    }}>
                    Aplikasi Kami Lebih dari 2 miliar orang di lebih dari 180 negara menggunakan REKBERIN untuk tetap
                    terhubung dengan teman dan keluarga, kapan pun dan di mana pun. REKBERIN adalah aplikasi berkirim
                    pesan, panggilan yang sederhana dan bertransaksi yg sangat aman, dan reliabel, serta dapat diunduh
                    ke ponsel di seluruh dunia secara gratis. Nama REKBERIN merupakan plesetan dari Rekening bersama
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'orange',
                    }}>
                    Misi Kami
                </Text>
                <Text
                    style={{
                        textAlign: 'justify',
                        marginBottom: 5,
                    }}>
                    REKBERIN dimulai sebagai alternatif dari SMS. Saat ini, produk kami mendukung pengguna untuk
                    mengirim dan menerima berbagai macam media: teks, foto, video, dokumen, lokasi, dan panggilan suara,
                    serta dukungan bertransaksi. Sebagian momen pribadi Anda dibagikan melalui REKBERIN. Oleh karena
                    itu, kami membangun enkripsi end-to-end dalam aplikasi kami. Di balik setiap keputusan produk
                    terdapat keinginan kami untuk memungkinkan orang-orang berkomunikasi di mana saja di dunia tanpa
                    pembatas.
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'orange',
                    }}>
                    Tim Kami
                </Text>
                <Text
                    style={{
                        textAlign: 'justify',
                        marginBottom: 5,
                    }}>
                    REKBERIN didirikan oleh Kingditho wulanesa mahardika. REKBERIN beroperasi sebagai aplikasi dengan
                    fokus utama untuk membangun layanan berkirim pesan dan transaksi yang cepat dan reliabel di mana
                    saja di dunia
                </Text>
            </View>
        </View>
    )
}

export { AboutUs }

import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import * as WebBrowser from 'expo-web-browser'
import { VerificationAccount } from 'pages/home/users/index'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Button, Card, Dialog, Text } from 'react-native-paper'

const Verification = (props: { item: VerificationAccount }) => {
    const navigation = useNavigation()
    const { item } = props

    const [dialog, setDialog] = useState(false)

    const handleAccept = () => {
        firestore()
            .collection('users')
            .where('phoneNumber', '==', item.phoneNumber)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    doc.ref
                        .update({
                            isIDCardVerified: true,
                        })
                        .then(() => {
                            setDialog(false)
                        })
                })
            })
    }
    const handleLoadImage = () => {
        WebBrowser.openBrowserAsync(item.image).then(() => {
            navigation.goBack()
        })
    }
    return (
        <Card
            style={{
                margin: 10,
            }}>
            <TouchableOpacity onPress={handleLoadImage}>
                <Card.Cover
                    source={{ uri: `${item.image}` }}
                    onError={e => {}}
                />
            </TouchableOpacity>
            <Card.Title title={'Data Diri'} />
            <Card.Content>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                    <View
                        style={{
                            marginRight: 10,
                        }}>
                        <Text>Nama</Text>
                        <Text>Tangal Lahir</Text>
                        <Text>Alamat</Text>
                        <Text>No. HP</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}>
                        <Text
                            style={{
                                textTransform: 'capitalize',
                            }}>
                            : {item.name}
                        </Text>
                        <Text>: {item.dob}</Text>
                        <Text>: {item.address}</Text>
                        <Text>: {item.phoneNumber}</Text>
                    </View>
                </View>
            </Card.Content>
            <Card.Title title={'Data Bank'} />
            <Card.Content>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                    <View
                        style={{
                            marginRight: 10,
                        }}>
                        <Text>Nama Bank</Text>
                        <Text>No. Rekening</Text>
                        <Text>Atas Nama</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}>
                        <Text
                            style={{
                                textTransform: 'capitalize',
                            }}>
                            : {item.bankName}
                        </Text>
                        <Text>: {item.bankAccount}</Text>
                        <Text>: {item.bankAccountName}</Text>
                    </View>
                </View>
            </Card.Content>
            <Card.Actions>
                <Button
                    onPress={() => {
                        setDialog(true)
                    }}
                    mode={'contained'}
                    style={{
                        marginLeft: 10,
                    }}>
                    Terima
                </Button>
            </Card.Actions>
            <Dialog visible={dialog}>
                <Dialog.Title>Terima</Dialog.Title>
                <Dialog.Content>
                    <Text>Apakah anda yakin ingin menerima data ini?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        onPress={() => {
                            setDialog(false)
                        }}>
                        Tidak
                    </Button>
                    <Button onPress={() => handleAccept()}>Ya</Button>
                </Dialog.Actions>
            </Dialog>
        </Card>
    )
}

export { Verification }

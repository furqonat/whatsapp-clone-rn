import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Header } from 'components'
import moment from 'moment'
import { RefundData } from 'pages/home/users/index'
import { RootStackParamList } from 'pages/screens'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Card, Dialog, Paragraph, Text } from 'react-native-paper'

type Props = NativeStackScreenProps<RootStackParamList, 'transaction_detail', 'Stack'>
type BankInfo = Omit<RefundData, 'id' | 'reason' | 'createdAt'>

const Transaction = ({ route }: Props) => {
    const navigate = useNavigation()
    const [dialog, setDialog] = useState(false)
    const [dialogReject, setDialogReject] = useState(false)
    const [receiver, setReceiver] = useState<BankInfo | null>(null)
    const [sender, setSender] = useState<BankInfo | null>(null)

    useEffect(() => {
        if (route.params) {
            if (route.params?.transaction?.receiverInfo?.phoneNumber) {
                firestore()
                    .collection('users')
                    .where('phoneNumber', '==', route.params?.transaction?.receiverInfo?.phoneNumber)
                    .get()
                    .then(querySnapshot => {
                        if (querySnapshot.empty) {
                            setReceiver(null)
                        } else {
                            querySnapshot.forEach(docs => {
                                // const ref = doc(db, 'users', docs.id, 'verification', item.receiverInfo.phoneNumber)
                                docs.ref.collection('verification').onSnapshot(snap => {
                                    snap.forEach(doc => {
                                        if (doc.exists) {
                                            const data = doc.data() as BankInfo
                                            setReceiver(data)
                                        } else {
                                            setReceiver(null)
                                        }
                                    })
                                })
                            })
                        }
                    })
            }
            if (route.params?.transaction?.senderPhoneNumber) {
                firestore()
                    .collection('users')
                    .where('phoneNumber', '==', route.params?.transaction?.senderPhoneNumber)
                    .get()
                    .then(querySnapshot => {
                        if (querySnapshot.empty) {
                            setSender(null)
                        } else {
                            querySnapshot.forEach(docs => {
                                docs.ref.collection('verification').onSnapshot(snap => {
                                    snap.forEach(doc => {
                                        if (doc.exists) {
                                            const data = doc.data() as BankInfo
                                            setSender(data)
                                        } else {
                                            setSender(null)
                                        }
                                    })
                                })
                            })
                        }
                    })
            }
        }
    }, [])
    const handleAccept = () => {
        firestore()
            .collection('transactions')
            .doc(route.params?.transaction?.id)
            .update({
                status: 'finish',
            })
            .then(() => {
                setDialog(false)
                navigate.goBack()
            })
    }

    const handleReject = () => {
        firestore()
            .collection('transactions')
            .doc(route.params?.transaction?.id)
            .update({
                status: 'reject',
            })
            .then(() => {
                setDialogReject(false)
                navigate.goBack()
            })
    }
    return (
        <View
            style={{
                height: '100%',
            }}>
            <Header
                title={`Detail Transaksi`}
                extraHeader={<></>}
            />
            <Card
                style={{
                    margin: 10,
                }}>
                <Card.Title title={'Detail Transaksi'} />
                <Card.Content>
                    <View
                        style={{
                            flexDirection: 'row',
                            display: 'flex',
                        }}>
                        <View
                            style={{
                                marginRight: 10,
                            }}>
                            <Text>Nama Transaksi</Text>
                            <Text>Jenis Transaksi</Text>
                            <Text>Status Transaksi</Text>
                            <Text>Total Transaksi</Text>
                            <Text>Tanggal Transaksi</Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                            }}>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {route?.params?.transaction?.transactionName}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {route?.params?.transaction?.transactionType}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {route?.params?.transaction?.transactionStatus}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : Rp. {route?.params?.transaction?.transactionAmount}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {moment(route?.params?.transaction?.createdAt).format('DD MMMM YYYY')}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
            <Card
                style={{
                    margin: 10,
                }}>
                <Card.Title title='Detail penerima' />
                <Card.Content>
                    <View
                        style={{
                            flexDirection: 'row',
                            display: 'flex',
                        }}>
                        <View
                            style={{
                                marginRight: 10,
                            }}>
                            <Text>Nama</Text>
                            <Text>No HP</Text>
                            <Text>Nama Bank</Text>
                            <Text>A/N</Text>
                            <Text>No Rekening</Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                            }}>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {route?.params?.transaction?.receiverInfo?.displayName}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {route?.params?.transaction?.receiverInfo?.phoneNumber}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {receiver?.bankName}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {receiver?.bankAccountName}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {receiver?.bankAccount}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            <Card
                style={{
                    margin: 10,
                }}>
                <Card.Title title='Detail pembeli' />
                <Card.Content>
                    <View
                        style={{
                            flexDirection: 'row',
                            display: 'flex',
                        }}>
                        <View
                            style={{
                                marginRight: 10,
                            }}>
                            <Text>Nama</Text>
                            <Text>No HP</Text>
                            <Text>Nama Bank</Text>
                            <Text>A/N</Text>
                            <Text>No Rekening</Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                            }}>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {sender?.bankAccountName}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {route?.params?.transaction?.senderPhoneNumber}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {sender?.bankName}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {sender?.bankAccountName}
                            </Text>
                            <Text
                                style={{
                                    textTransform: 'capitalize',
                                }}>
                                : {sender?.bankAccount}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    margin: 5,
                }}>
                <Button
                    onPress={() => setDialogReject(true)}
                    mode={'outlined'}
                    color={'red'}
                    style={{
                        flex: 1,
                        margin: 5,
                    }}>
                    Tolak
                </Button>
                <Button
                    onPress={() => setDialog(true)}
                    mode={'contained'}
                    style={{
                        flex: 1,
                        margin: 5,
                    }}>
                    Terima
                </Button>
            </View>
            <Dialog
                visible={dialog}
                onDismiss={() => setDialog(false)}
                style={{
                    backgroundColor: '#fff',
                    padding: 10,
                }}>
                <Dialog.Title>Selesaikan Transaksi</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>Apakah anda yakin ingin menyelesaikan transaksi ini?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialog(false)}>Batal</Button>
                    <Button onPress={handleAccept}>Selesaikan</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog
                visible={dialogReject}
                onDismiss={() => setDialogReject(false)}
                style={{
                    backgroundColor: '#fff',
                    padding: 10,
                }}>
                <Dialog.Title>Tolak Transaksi</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>Apakah anda yakin ingin menolak transaksi ini?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialogReject(false)}>Batal</Button>
                    <Button onPress={handleReject}>Tolak</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    )
}
export { Transaction }

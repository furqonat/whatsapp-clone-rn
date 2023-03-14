import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Header } from 'components'
import moment from 'moment'
import { TransactionList } from 'pages/home/transaction/transaction-list'
import { RefundData, VerificationAccount } from 'pages/home/users/index'
import { Verification } from 'pages/home/users/verification'
import { RootStackParamList } from 'pages/screens'
import { useEffect, useState } from 'react'
import { FlatList, StatusBar, Text, View } from 'react-native'
import { Button, Card, Chip, Dialog, IconButton, Menu, Paragraph, Provider } from 'react-native-paper'
import { ITransactions } from 'utils'

type TransactionScreenProp = StackNavigationProp<RootStackParamList, 'transaction_detail'>

const AdminRefund = () => {
    const navigate = useNavigation<TransactionScreenProp>()
    const [selectedRefund, setSelectedRefund] = useState<RefundData>({} as RefundData)
    const [dialog, setDialog] = useState(false)
    const [users, setUsers] = useState<VerificationAccount[]>([])
    const [transactions, setTransactions] = useState<ITransactions[]>([])
    const [refund, setRefund] = useState<RefundData[]>([])
    const [title, setTitle] = useState('Transaksi')
    const [menuState, setMenuState] = useState(false)

    const getTotalAmount = (orderId: string) => {
        const value = async () => {
            const data = await firestore().collection('transactions').doc(orderId).get()
            return data.data()?.totalAmount
        }
        return value().then(res => res)
    }

    useEffect(() => {
        if (title === 'Verifikasi Users') {
            return firestore()
                .collection('users')
                .where('isIDCardVerified', '==', false)
                .onSnapshot(querySnapshot => {
                    querySnapshot.docs.map(doc => {
                        doc.ref.collection('verification').onSnapshot(snap => {
                            snap.forEach(docs => {
                                const data = docs.data() as VerificationAccount
                                const verif = { ...data, phoneNumber: doc.data().phoneNumber }
                                setUsers(prev => {
                                    if (prev.filter(item => item.phoneNumber === verif.phoneNumber).length === 0) {
                                        return [...prev, verif]
                                    } else {
                                        return [...prev]
                                    }
                                })
                            })
                        })
                    })
                })
        } else if (title === 'Transaksi') {
            const transactionUnsubscribe = firestore()
                .collection('transactions')
                .where('status', '==', 'done')
                .onSnapshot(querySnapshot => {
                    const transactionData: ITransactions[] = []
                    querySnapshot?.forEach(docs => {
                        const data = { ...docs.data(), id: docs.id } as ITransactions
                        transactionData.push(data)
                    })
                    setTransactions(
                        transactionData.sort(
                            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        )
                    )
                })
            return () => transactionUnsubscribe()
        } else {
            const refundUnsubscribe = firestore()
                .collection('refunds')
                .where('status', '==', false)
                .onSnapshot(querySnapshot => {
                    const refundData: RefundData[] = []
                    querySnapshot.docs.map(async docs => {
                        const data = docs.data() as RefundData
                        const f = await firestore().collection('transactions').doc(docs.id).get()
                        refundData.push({
                            amount: data.amount,
                            bankAccount: data.bankAccount,
                            bankAccountName: data.bankAccountName,
                            bankName: data.bankName,
                            reason: data.reason,
                            orderId: docs.id,
                            createdAt: data.createdAt,
                            totalAmount: f.data()?.transactionAmount,
                            id: docs.id,
                        })
                        setRefund(refundData)
                    })
                })
            return () => refundUnsubscribe()
        }
    }, [title])

    const handleOnPressTransaction = (transaction: ITransactions) => {
        navigate.navigate('transaction_detail', { transaction })
    }
    const handleOnPressRefund = (refund?: RefundData) => {
        if (refund) {
            firestore()
                .collection('refunds')
                .doc(refund.orderId)
                .update({
                    status: true,
                })
                .then(() => {
                    firestore().collection('transactions').doc(refund.orderId).update({
                        status: 'refund-accepted',
                    })
                })
        }
    }

    return (
        <Provider>
            <StatusBar />
            <Header
                title={title}
                extraHeader={
                    <Menu
                        visible={menuState}
                        onDismiss={() => setMenuState(false)}
                        anchor={
                            <IconButton
                                color={'#fff'}
                                icon={'filter-variant'}
                                onPress={() => setMenuState(true)}
                            />
                        }>
                        <Menu.Item
                            onPress={() => {
                                setTitle('Verifikasi Users')
                                setMenuState(false)
                            }}
                            title='Verifikasi Users'
                        />
                        <Menu.Item
                            onPress={() => {
                                setTitle('Transaksi')
                                setMenuState(false)
                            }}
                            title='Transaksi'
                        />
                        <Menu.Item
                            onPress={() => {
                                setTitle('Refund')
                                setMenuState(false)
                            }}
                            title='Refund'
                        />
                    </Menu>
                }
            />
            {title === 'Verifikasi Users' ? (
                <FlatList
                    data={users}
                    renderItem={item => <Verification item={item.item} />}
                />
            ) : title === 'Transaksi' ? (
                <TransactionList
                    transactions={transactions}
                    onPress={handleOnPressTransaction}
                />
            ) : (
                <FlatList
                    data={refund}
                    renderItem={item => (
                        <Card
                            style={{
                                margin: 10,
                            }}>
                            <Card.Title title={item.item.orderId} />
                            <Card.Content>
                                <Chip>
                                    <Text>{item.item.reason}</Text>
                                </Chip>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                    }}>
                                    Detail
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                    }}>
                                    <View
                                        style={{
                                            marginRight: 10,
                                        }}>
                                        <Text>Nama Bank</Text>
                                        <Text>Nomor Rekening</Text>
                                        <Text>Atas Nama</Text>
                                        <Text>Tangal Refund</Text>
                                        <Text>Total Refund</Text>
                                        <Text>Jumlah Transaksi</Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                        }}>
                                        <Text>: {item.item.bankName}</Text>
                                        <Text>: {item.item.bankAccount}</Text>
                                        <Text>: {item.item.bankAccountName}</Text>
                                        <Text>: {moment(item.item.createdAt).format('DD MMMM YYYY')}</Text>
                                        <Text>: Rp. {item.item.amount}</Text>
                                        <Text>: Rp. {`${item.item?.totalAmount}`}</Text>
                                    </View>
                                </View>
                                <Card.Actions>
                                    <Button
                                        mode={'contained'}
                                        style={{ flex: 1 }}
                                        onPress={() => {
                                            setSelectedRefund(item.item)
                                            setDialog(true)
                                        }}>
                                        Terima
                                    </Button>
                                </Card.Actions>
                            </Card.Content>
                        </Card>
                    )}
                />
            )}
            <Dialog
                visible={dialog}
                onDismiss={() => setDialog(false)}>
                <Dialog.Title>Terima Refund</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>Apakah anda yakin ingin menerima refund ini?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialog(false)}>Tidak</Button>
                    <Button onPress={() => handleOnPressRefund(selectedRefund)}>Ya</Button>
                </Dialog.Actions>
            </Dialog>
        </Provider>
    )
}
export { AdminRefund }

import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import axios from 'axios'
import * as Clipboard from 'expo-clipboard'
import * as WebBrowser from 'expo-web-browser'
import moment from 'moment'
import { Divider, Modal, Stack, Text, View } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import React, { useState } from 'react'
import { Button, Dialog, Paragraph } from 'react-native-paper'
import { ITransactions, useFirebase } from 'utils'

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin' | 'edit_transaction'>

const TransactionItem = (props: { transaction: ITransactions }) => {
    const {
        transactionName,
        transactionAmount,
        createdAt,
        status,
        transactionType,
        transactionStatus,
        id,
        payment_type,
        receiverInfo,
        transactionToken,
        refund = null,
        seller,
    } = props.transaction

    const navigation = useNavigation<signInScreenProp>()

    const [alertDialog, setAlertDialog] = useState(false)
    const [dialogAcceptRefund, setDialogAcceptRefund] = useState(false)
    const [dialogRejectRefund, setDialogRejectRefund] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [loadingTransaction, setLoadingTransaction] = useState(false)
    const { user } = useFirebase()

    const openInNewTab = () => {
        setLoadingTransaction(true)
        if (transactionToken) {
            setLoadingTransaction(false)
            WebBrowser.openBrowserAsync(transactionToken.redirect_url).then(() => {
                navigation.goBack()
            })
        } else {
            axios
                .post(
                    // @ts-ignore
                    `${process.env.SERVER_URL}api/v1/transactions/new`,
                    {
                        customer_details: {
                            first_name: receiverInfo.displayName,
                            phone: receiverInfo.phoneNumber,
                            email: receiverInfo.email,
                        },
                        amount: transactionAmount,
                        order_id: id,
                    },
                    {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then(response => {
                    if (response.status === 200) {
                        setLoadingTransaction(false)
                        firestore()
                            .collection('transactions')
                            .doc(id)
                            .update({
                                transactionToken: response.data.transactionToken,
                            })
                            .then(() => {
                                WebBrowser.openBrowserAsync(response.data.transactionToken.redirect_url).then(() => {
                                    navigation.goBack()
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                alert('Gagal membuat transaksi, silahkan hubungi admin')
                                // setOpenDialog(false)
                                // onDone && onDone(false)
                            })
                    }
                })
                .catch(err => {
                    console.log(err.message)
                    setLoadingTransaction(false)
                    alert('Gagal membuat transaksi, silahkan hubungi admin')
                    // setOpenDialog(false)
                    // onDone && onDone(false)
                })
            // WebBrowser.openBrowserAsync(url).then(_ => {})
        }
    }
    const editTransaction = () => {
        navigation.navigate('edit_transaction', {
            transactionId: id,
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'blue.400'
            case 'pending':
                return 'yellow.400'
            case 'settlement':
                return 'green.400'
            case 'expire':
                return 'red.400'
            case 'done':
                return 'green.400'
            case 'refund':
                return 'red.400'
            case 'finish':
                return 'green.400'
            case 'request-refund':
                return 'yellow.500'
            case 'reject':
                return 'red.400'
            case 'refund-accepted':
                return 'red.400'
            case 'cancel':
                return 'red.400'
            default:
                return 'blue.400'
        }
    }

    const getStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'Aktif'
            case 'pending':
                return 'Belum dibayar'
            case 'settlement':
                return 'Sudah dibayar'
            case 'expire':
                return 'Kadaluarsa'
            case 'done':
                return 'Di proses Admin'
            case 'refund':
                return 'Refund'
            case 'request-refund':
                return 'Permintaan Refund'
            case 'finish':
                return 'Transaksi sukses'
            case 'reject':
                return 'Transaksi ditolak'
            case 'refund-accepted':
                return 'Refund diterima'
            case 'cancel':
                return 'Transaksi dibatalkan'
            default:
                return 'Aktif'
        }
    }

    const handlePressRefund = () => {
        navigation.navigate('refund', {
            transactionId: id,
        })
    }

    const handleConfirm = () => {
        setAlertDialog(true)
    }

    const handleOnButtonPress = () => {
        setIsLoading(true)
        firestore()
            .collection('transactions')
            .doc(id)
            .update({
                status: 'done',
            })
            .then(() => {
                setIsLoading(false)
                setAlertDialog(false)
            })
    }

    const handleAcceptRefund = () => {
        setDialogAcceptRefund(true)
        firestore()
            .collection('transactions')
            .doc(id)
            .update({
                status: 'refund',
            })
            .then(() => {
                firestore()
                    .collection('users')
                    .where('phoneNumber', '==', user?.phoneNumber)
                    .get()
                    .then(querySnapshot => {
                        if (querySnapshot.empty) {
                            setDialogAcceptRefund(false)
                        } else {
                            querySnapshot.forEach(docData => {
                                firestore()
                                    .collection('users')
                                    .doc(`${docData.id}`)
                                    .collection('verification')
                                    .doc(`${user?.phoneNumber}`)
                                    .get()
                                    .then(document => {
                                        if (document.exists) {
                                            const data = document.data()
                                            firestore()
                                                .collection('refunds')
                                                .doc(id)
                                                .set({
                                                    reason: refund?.reason,
                                                    createdAt: new Date().getTime(),
                                                    bankName: data?.bankName,
                                                    bankAccount: data?.bankAccount,
                                                    bankAccountName: data?.bankAccountName,
                                                    orderId: id,
                                                    status: false,
                                                    amount: Number(refund?.amount),
                                                })
                                                .then(() => {
                                                    // setLoading(false)
                                                    // navigation.goBack()
                                                    setDialogAcceptRefund(false)
                                                })
                                                .catch(() => {
                                                    // setLoading(false)
                                                    setDialogAcceptRefund(false)
                                                })
                                        }
                                    })
                            })
                        }
                    })
                    .catch(() => {
                        setDialogAcceptRefund(false)
                    })
            })
    }

    const handleRejectRefund = () => {
        setDialogRejectRefund(true)
        firestore()
            .collection('transactions')
            .doc(id)
            .update({
                status: 'settlement',
                refund: null,
            })
            .then(() => {
                setDialogRejectRefund(false)
            })
    }

    return (
        <Stack
            direction={'column'}
            height={'100%'}>
            <Stack
                direction={'column'}
                alignItems={'center'}>
                <View>
                    <Stack direction={'column'}>
                        <Stack
                            justifyContent={'space-between'}
                            direction={'row'}>
                            <Text variant={'md'}>{transactionName}</Text>
                            <Text variant={'md'}>
                                {Number(transactionAmount).toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                })}
                            </Text>
                        </Stack>
                        <Text variant={'sm'}>
                            <Text
                                color={getStatusColor(props.transaction?.status)}
                                variant={'sm'}>
                                {getStatus(props?.transaction?.status)} &nbsp;
                            </Text>
                            <Text>{moment(createdAt).format('DD MMMM YYYY')}</Text>
                        </Text>
                        <Divider />
                        <Stack
                            mt={4}
                            direction={'column'}>
                            <Stack
                                space={10}
                                direction={'row'}
                                justifyContent={'space-between'}>
                                <Text variant={'sm'}>Tipe Transaksi</Text>
                                <Text variant={'sm'}>{transactionType}</Text>
                            </Stack>
                            <Stack
                                space={10}
                                direction={'row'}
                                justifyContent={'space-between'}>
                                <Text variant={'sm'}>Info Transaksi</Text>
                                <Text
                                    color={transactionStatus === 'legal' ? 'green.400' : 'red.400'}
                                    fontWeight={'bold'}
                                    variant={'sm'}>
                                    {transactionStatus}
                                </Text>
                            </Stack>
                            <Stack
                                space={10}
                                direction={'row'}
                                justifyContent={'space-between'}>
                                <Text variant={'sm'}>Transaksi ID</Text>
                                <Text
                                    onPress={() => {
                                        Clipboard.setStringAsync(id).then(() => {
                                            alert('transaction id copied')
                                        })
                                    }}
                                    variant={'sm'}>
                                    {String(id).slice(0, 15)}...
                                </Text>
                            </Stack>
                        </Stack>
                        <Divider />
                        <Stack mt={2}>
                            {status !== 'ACTIVE' &&
                            status !== 'request-refund' &&
                            status !== 'settlement' &&
                            status !== 'done' &&
                            status !== 'refund' &&
                            status !== 'reject' &&
                            status !== 'cancel' &&
                            status !== 'finish' ? (
                                <Stack
                                    direction={'column'}
                                    justifyContent={'space-between'}>
                                    {status !== 'expire' ? (
                                        <View
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                width: '100%',
                                                padding: 5,
                                            }}>
                                            {seller !== user?.phoneNumber && (
                                                <Button
                                                    loading={loadingTransaction}
                                                    disabled={loadingTransaction}
                                                    style={{
                                                        flex: 1,
                                                        marginRight: 5,
                                                    }}
                                                    mode={'contained'}
                                                    onPress={() => openInNewTab(/*transactionToken.redirect_url*/)}>
                                                    Bayar
                                                </Button>
                                            )}
                                            {!transactionToken && (
                                                <Button
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                    onPress={editTransaction}
                                                    mode={'outlined'}>
                                                    Edit
                                                </Button>
                                            )}
                                        </View>
                                    ) : null}
                                </Stack>
                            ) : (
                                <Stack
                                    space={4}
                                    direction={'column'}
                                    justifyContent={'space-between'}>
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'space-between'}>
                                        <Text variant={'sm'}>Metode Pembayaran</Text>
                                        {payment_type && <Text>{payment_type}</Text>}
                                    </Stack>
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'space-between'}>
                                        {status === 'settlement' ? (
                                            <Button
                                                mode={'contained'}
                                                onPress={handlePressRefund}>
                                                Ajukan Refund
                                            </Button>
                                        ) : null}
                                        {status === 'settlement' ? (
                                            <Button onPress={handleConfirm}>
                                                <Text color={'white'}>Konfirmasi</Text>
                                            </Button>
                                        ) : null}
                                        {status === 'request-refund' &&
                                        refund &&
                                        refund.requestBy !== user?.phoneNumber ? (
                                            <>
                                                <Button
                                                    color={'red'}
                                                    mode={'outlined'}
                                                    onPress={() => setDialogRejectRefund(true)}>
                                                    Tolak Refund
                                                </Button>
                                                <Button
                                                    mode={'contained'}
                                                    onPress={() => setDialogAcceptRefund(true)}>
                                                    Terima Refund
                                                </Button>
                                            </>
                                        ) : null}
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </View>
            </Stack>
            <Modal
                safeAreaTop={true}
                isOpen={alertDialog}
                onClose={() => {
                    if (isLoading) return
                    setAlertDialog(false)
                }}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>
                        <Text>Transaksi</Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Apakah anda yakin ingin melakukan menyelesaikan transaksi ini?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            disabled={isLoading}
                            mode={'contained'}
                            onPress={() => setAlertDialog(false)}>
                            Batal
                        </Button>
                        <Button
                            disabled={isLoading}
                            onPress={handleOnButtonPress}>
                            Lanjutkan
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Dialog visible={dialogAcceptRefund}>
                <Dialog.Title>Terima Refund</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>Apakah anda yakin ingin menerima refund?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialogAcceptRefund(false)}>Batal</Button>
                    <Button onPress={handleAcceptRefund}>Terima</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog visible={dialogRejectRefund}>
                <Dialog.Title>Tolak Refund</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>Apakah anda yakin ingin menolak refund?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialogRejectRefund(false)}>Batal</Button>
                    <Button onPress={handleRejectRefund}>Tolak</Button>
                </Dialog.Actions>
            </Dialog>
        </Stack>
    )
}

export { TransactionItem }

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import { doc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { Button, Divider, Modal, Stack, Text, View } from "native-base";
import { RootStackParamList } from "pages/screens";
import React, { useState } from "react";
import { ITransactions, db, useFirebase } from "utils";

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin'>

const TransactionItem = (props: { transaction: ITransactions }) => {
    const {
        transactionName,
        transactionAmount,
        createdAt,
        status,
        transactionType,
        transactionStatus,
        id,
        transactionToken,
        payment_type,
        senderUid
    } = props.transaction


    const { user } = useFirebase()
    const navigation = useNavigation<signInScreenProp>()
    const [alertDialog, setAlertDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const openInNewTab = (url: string) => {
        WebBrowser.openBrowserAsync(url).then(_ => { })
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
            case 'finish':
                return 'Transaksi sukses'
            default:
                return 'Aktif'
        }
    }

    const handlePressRefund = () => {
        navigation.navigate('refund', {
            transactionId: id
        })
    }



    const handleConfirm = () => {
        setAlertDialog(true)
    }

    const handleOnButtonPress = () => {
        setIsLoading(true)
        const docRef = doc(db, 'transactions', id)
        updateDoc(docRef, {
            status: 'done'
        }).then(() => {
            setIsLoading(false)
            setAlertDialog(false)
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
                    <Stack
                        direction={'column'}>
                        <Stack
                            justifyContent={'space-between'}
                            space={3}
                            direction={'row'}>
                            <Text variant={'md'}>
                                {transactionName}
                            </Text>
                            <Text variant={'md'}>
                                {
                                    Number(transactionAmount).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR'
                                    })
                                }
                            </Text>
                        </Stack>
                        <Text variant={'sm'}>
                            <Text
                                color={getStatusColor(props.transaction?.status)}
                                variant={'sm'}>
                                {getStatus(props?.transaction?.status)} &nbsp;
                            </Text>
                            <Text>
                                {moment(createdAt).format('DD MMMM YYYY')}
                            </Text>
                        </Text>
                        <Divider />
                        <Stack
                            mt={4}
                            direction={'column'}
                            space={1}>
                            <Stack
                                space={10}
                                direction={'row'}
                                justifyContent={'space-between'}>
                                <Text variant={'sm'}>
                                    Tipe Transaksi
                                </Text>
                                <Text variant={'sm'}>
                                    {transactionType}
                                </Text>
                            </Stack>
                            <Stack
                                space={10}
                                direction={'row'}
                                justifyContent={'space-between'}>
                                <Text variant={'sm'}>
                                    Info Transaksi
                                </Text>
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
                                <Text variant={'sm'}>
                                    Transaksi ID
                                </Text>
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
                        <Stack
                            mt={2}>
                            {
                                status !== 'ACTIVE' && status !== 'settlement' && status !== 'done' && status !== 'refund' && status !== 'finish' ? (
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'space-between'}>
                                        {
                                            transactionToken && senderUid === user?.uid && status !== 'expire' ? (
                                                <Button
                                                    onPress={() => openInNewTab(transactionToken.redirect_url)}>
                                                    <Text color={'white'}>Bayar</Text>
                                                </Button>
                                            ) : null
                                        }
                                    </Stack>
                                ) : (
                                    <Stack
                                        space={4}
                                        direction={'column'}
                                        justifyContent={'space-between'}>
                                        <Stack
                                            direction={'row'}
                                            justifyContent={'space-between'}>
                                            <Text
                                                variant={'sm'}>
                                                Metode Pembayaran
                                            </Text>
                                            {
                                                payment_type && (<Text>{payment_type}</Text>)
                                            }
                                        </Stack>
                                        <Stack
                                            direction={'row'}
                                            justifyContent={'space-between'}>
                                            {
                                                status === 'settlement' ? (
                                                    <Button
                                                        onPress={handlePressRefund}
                                                        backgroundColor={'yellow.600'}>
                                                        <Text color={'white'}>Ajukan Refund</Text>
                                                    </Button>
                                                ) : null
                                            }
                                            {
                                                status === 'settlement' ? (
                                                    <Button
                                                        onPress={handleConfirm}>
                                                        <Text color={'white'}>Konfirmasi</Text>
                                                    </Button>
                                                ) : null
                                            }

                                        </Stack>
                                    </Stack>
                                )
                            }
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
                        <Button.Group space={2}>
                            <Button
                                isDisabled={isLoading}
                                variant={'ghost'}
                                onPress={() => setAlertDialog(false)}>
                                <Text>Batal</Text>
                            </Button>
                            <Button
                                isDisabled={isLoading}
                                onPress={handleOnButtonPress}>
                                <Text color={'white'}>Lanjutkan</Text>
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Stack>
    )
}

export { TransactionItem };

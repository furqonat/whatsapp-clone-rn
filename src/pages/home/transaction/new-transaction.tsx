import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import axios from 'axios'
import * as WebBrowser from 'expo-web-browser'
import { doc, setDoc } from 'firebase/firestore'
import { Button, IconButton, Input, Modal, Radio, Select, Stack, Text, VStack } from "native-base"
import { RootStackParamList } from "pages/screens"
import React, { useState } from "react"
import { GestureResponderEvent } from 'react-native'
import { db, TransactionObject, useFirebase } from "utils"

type Props = NativeStackScreenProps<RootStackParamList, 'new_transaction', 'Stack'>

const NewTransaction = (props: Props) => {

    const { contact } = props.route.params

    const { user } = useFirebase()

    const navigation = useNavigation()

    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [fee, setFee] = useState(0)
    const [type, setType] = useState('REKBER')
    const [status, setStatus] = useState('legal')
    const [trans, setTrans] = useState<TransactionObject | null>(null)
    const [alertDialog, setAlertDialog] = useState(false)

    const handleChangeTitle = (event: string) => {
        setTitle(event)
    }

    const handleAmountChange = (event: string) => {
        if (event) {
            // accept only number
            if (event !== '' && event.match(/^[0-9]*$/)) {
                setAmount(event)
                const value = event
                if (value) {
                    if (Number(value) > 0) {
                        const fees = 10000
                        if (Number(value) <= 5000000) {
                            setFee(fees)
                        } else {
                            const realFee = Number(value) / 5000000
                            setFee(Math.ceil(realFee) * fees)
                        }
                        const transactions: TransactionObject = {
                            transactionName: title,
                            transactionAmount: Number(event),
                            transactionFee: fees,
                            transactionType: type,
                            transactionStatus: status,
                            receiverInfo: contact!!,
                        }
                        setTrans(transactions)
                        // props.onClick(transactions)
                    } else {
                        return
                    }
                } else {
                    return
                }
            }
        } else {
            setAmount('')
            // props.onClick()
        }
    }

    const handleBack = () => {
        navigation.goBack()
    }

    const handleOnButtonPress = (e: GestureResponderEvent) => {
        e.preventDefault()
        if (trans) {
            createTransaction(trans)
        } else {
            alert('Galat saat membuat transaksi')
        }
    }

    const createTransaction = (transaction: TransactionObject) => {
        // setOpenDialog(true)

        const id = transaction.receiverInfo.uid + user?.uid + new Date().getTime()
        const orderId = `order-${new Date().getTime()}`
        const dbRef = doc(db, 'transactions', orderId)
        axios.post(`${process.env.SERVER_URL}api/v1/transactions/new`, {
            customer_details: {
                first_name: transaction.receiverInfo.displayName,
                phone: transaction.receiverInfo.phoneNumber,
                email: transaction.receiverInfo.email
            },
            amount: transaction.transactionAmount + transaction.transactionFee,
            order_id: orderId,
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        }).then((response) => {
            if (response.status === 200) {
                setDoc(dbRef, {
                    id: id,
                    senderPhoneNumber: user?.phoneNumber,
                    senderUid: user?.uid,
                    senderEmail: user?.email ?? "",
                    receiverPhoneNumber: transaction.receiverInfo.phoneNumber,
                    receiverUid: transaction.receiverInfo.uid,
                    receiverEmail: transaction.receiverInfo.email,
                    ...transaction,
                    createdAt: new Date().toISOString(),
                    status: "pending",
                    transactionToken: response.data.transactionToken,
                }).then(() => {
                    WebBrowser.openBrowserAsync(response.data.transactionToken.redirect_url).then(() => {
                        navigation.goBack()
                    })
                    // openNewWindow(response.data.transactionToken.redirect_url)
                    // setOpenDialog(false)
                    // onDone && onDone(true)
                    setAlertDialog(false)
                }).catch(() => {
                    console.log('error')
                    // setOpenDialog(false)
                    // onDone && onDone(false)
                    alert('Gagal membuat transaksi, silahkan coba lagi')
                })
            }
        }).catch((error) => {
            console.log('error', error)
            alert('Gagal membuat transaksi, silahkan hubungi admin')
            // setOpenDialog(false)
            // onDone && onDone(false)
        })
    }

    const handleOpenModal = () => {
        if (trans && title !== '' && amount !== '') {
            setAlertDialog(true)
        } else {
            alert('Silahkan isi semua data')
        }
    }

    return (
        <Stack
            space={2}
            direction={'column'}>
            <Stack
                zIndex={1}
                h={'60px'}
                display={'flex'}
                backgroundColor={'violet.800'}
                alignItems={'center'}
                justifyContent='space-between'
                direction={'row'}>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    space={2}>
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
                        color={'white'}
                        fontSize={20}
                        bold={true}>
                        New Transaction
                    </Text>
                </Stack>
            </Stack>
            <VStack
                padding={4}>
                <Text variant={'sm'}>Nama transaksi</Text>
                <Input
                    value={title}
                    onChangeText={handleChangeTitle}
                    size={'small'}
                    placeholder={'Contoh: Pembelian Akun PUBG'} />
                <Text variant={'sm'}>Informasi penerima</Text>
                <Stack
                    space={2}
                    justifyContent={'space-between'}
                    direction={'column'}>
                    <Input
                        isDisabled={true}
                        size={'small'}
                        value={`${contact?.displayName}`} />
                    <Input
                        isDisabled={true}
                        size={'small'}
                        value={`${contact?.phoneNumber}`} />
                </Stack>
                <Text variant={'sm'}>Tipe transaksi</Text>
                <Stack
                    space={2}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    direction={'column'}>
                    <Select
                        width={'100%'}
                        selectedValue={type}
                        onValueChange={(itemValue) => setType(itemValue)}
                        size={'small'}>
                        <Select.Item value="REKBER" label="Rekber" />
                        <Select.Item value="PULBER" label="Pulber" />
                    </Select>
                    <Radio.Group
                        onChange={(nextValue) => setStatus(nextValue)}
                        defaultValue={status}
                        name={'Jenis Transaksi'}>
                        <Stack
                            space={2}
                            alignItems={'stretch'}
                            direction={'row'}>
                            <Radio
                                value={'legal'}>
                                <Text variant={'sm'}>Legal</Text>
                            </Radio>
                            <Radio
                                value={'illegal'}>
                                <Text variant={'sm'}>Illegal</Text>
                            </Radio>
                        </Stack>
                    </Radio.Group>
                </Stack>
                <Text variant={'sm'}>Total pembayaran</Text>
                <Stack
                    width={'100%'}
                    space={2}
                    justifyContent={'space-between'}
                    direction={'column'}>
                    <Input
                        value={amount}
                        onChangeText={handleAmountChange}
                        placeholder={'Jumlah'}
                        size={'small'}
                    />
                    <Input
                        value={String(fee)}
                        isDisabled={true}
                        placeholder={'0'}
                        size={'small'} />
                </Stack>

                <Button
                    onPress={handleOpenModal}
                    mt={3}>
                    <Text color={'white'}>Lanjutkan</Text>
                </Button>
                <Modal
                    safeAreaTop={true}
                    isOpen={alertDialog}
                    onClose={() => setAlertDialog(false)}>
                    <Modal.Content>
                        <Modal.CloseButton />
                        <Modal.Header>
                            <Text>Transaksi</Text>
                        </Modal.Header>
                        <Modal.Body>
                            <Text>Apakah anda yakin ingin melakukan transaksi ini?</Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button
                                    variant={'ghost'}
                                    onPress={() => setAlertDialog(false)}>
                                    <Text>Batal</Text>
                                </Button>
                                <Button
                                    onPress={handleOnButtonPress}>
                                    <Text color={'white'}>Lanjutkan</Text>
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </VStack>

        </Stack>
    )
}



export { NewTransaction }

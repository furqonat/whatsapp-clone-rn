import { Ionicons } from '@expo/vector-icons'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNavigationProp } from '@react-navigation/stack'
import { Button, IconButton, Input, Modal, Radio, Select, Stack, Text, VStack } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import React, { useState } from 'react'
import { GestureResponderEvent } from 'react-native'
import { IContact, TransactionObject, useFirebase } from 'utils'

type Props = NativeStackScreenProps<RootStackParamList, 'new_transaction', 'Stack'>
type NavigationStack = StackNavigationProp<RootStackParamList, 'tabbar'>
const NewTransaction = (props: Props) => {
    const { contact } = props.route.params

    const { user } = useFirebase()

    const navigation = useNavigation<NavigationStack>()

    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [fee, setFee] = useState(0)
    const [type, setType] = useState('REKBER')
    const [status, setStatus] = useState('legal')
    const [meAs, setMeAs] = useState('')
    const [trans, setTrans] = useState<TransactionObject | null>(null)
    const [alertDialog, setAlertDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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
                            transactionAmount: Number(event) + fees,
                            transactionFee: fees,
                            transactionType: type,
                            transactionStatus: status,
                            receiverInfo:
                                meAs === 'seller'
                                    ? ({
                                          displayName: user?.displayName,
                                          email: user?.email,
                                          phoneNumber: user?.phoneNumber,
                                          uid: user?.uid,
                                      } as IContact)
                                    : (contact as IContact),
                        }
                        setTrans(transactions)
                        // props.onClick(transactions)
                    }
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
        setIsLoading(true)
        const id = transaction.receiverInfo.uid + user?.uid + new Date().getTime()
        const orderId = `order-${new Date().getTime()}`
        const dbRef = firestore().collection('transactions').doc(orderId)
        dbRef
            .set({
                id,
                senderPhoneNumber: meAs !== 'seller' ? user?.phoneNumber : contact?.phoneNumber,
                senderUid: meAs !== 'seller' ? user?.uid : contact?.uid,
                senderEmail: meAs !== 'seller' ? user?.email : contact?.email,
                receiverPhoneNumber: meAs !== 'seller' ? contact?.phoneNumber : user?.phoneNumber,
                receiverUid: meAs !== 'seller' ? contact?.uid : user?.uid,
                receiverEmail: meAs !== 'seller' ? contact?.email : user?.email,
                ...transaction,
                createdAt: new Date().toISOString(),
                status: 'pending',
                seller: meAs === 'seller' ? user?.phoneNumber : transaction.receiverInfo.phoneNumber,
                // transactionToken: response.data.transactionToken,
            })
            .then(() => {
                setAlertDialog(false)
                setIsLoading(false)
                navigation.navigate('tabbar')
            })
            .catch(() => {
                setIsLoading(false)
                // setOpenDialog(false)
                // onDone && onDone(false)
                alert('Gagal membuat transaksi, silahkan coba lagi')
            })
    }

    const handleOpenModal = () => {
        if (trans && title !== '' && amount !== '' && meAs !== '') {
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
            <VStack padding={4}>
                <Text variant={'sm'}>Nama transaksi</Text>
                <Input
                    value={title}
                    onChangeText={handleChangeTitle}
                    size={'small'}
                    placeholder={'Contoh: Pembelian Akun PUBG'}
                />
                <Text variant={'sm'}>Informasi penerima</Text>
                <Stack
                    space={2}
                    justifyContent={'space-between'}
                    direction={'column'}>
                    <Input
                        isDisabled={true}
                        size={'small'}
                        value={`${contact?.displayName}`}
                    />
                    <Input
                        isDisabled={true}
                        size={'small'}
                        value={`${contact?.phoneNumber}`}
                    />
                </Stack>
                <Stack
                    space={2}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    direction={'column'}>
                    <Text> Saya Sebagai {meAs === 'seller' ? 'Penjual' : 'Pembeli'} </Text>
                    <Radio.Group
                        onChange={nextValue => setMeAs(nextValue)}
                        defaultValue={status}
                        name={`Saya Sebagai`}>
                        <Stack
                            space={2}
                            alignItems={'stretch'}
                            direction={'row'}>
                            <Radio value={'seller'}>
                                <Text variant={'sm'}>Penjual</Text>
                            </Radio>
                            <Radio value={'buyer'}>
                                <Text variant={'sm'}>Pembeli</Text>
                            </Radio>
                        </Stack>
                    </Radio.Group>
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
                        onValueChange={itemValue => setType(itemValue)}
                        size={'small'}>
                        <Select.Item
                            value='REKBER'
                            label='Rekber'
                        />
                        <Select.Item
                            value='PULBER'
                            label='Pulber'
                        />
                    </Select>
                    <Radio.Group
                        onChange={nextValue => setStatus(nextValue)}
                        defaultValue={status}
                        name={'Jenis Transaksi'}>
                        <Stack
                            space={2}
                            alignItems={'stretch'}
                            direction={'row'}>
                            <Radio value={'legal'}>
                                <Text variant={'sm'}>Legal</Text>
                            </Radio>
                            <Radio value={'illegal'}>
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
                        size={'small'}
                    />
                </Stack>

                <Button
                    onPress={handleOpenModal}
                    mt={3}>
                    <Text color={'white'}>Lanjutkan</Text>
                </Button>
                <Modal
                    safeAreaTop={true}
                    isOpen={alertDialog}
                    onClose={() => {
                        if (!isLoading) {
                            setAlertDialog(false)
                        }
                    }}>
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
            </VStack>
        </Stack>
    )
}

export { NewTransaction }

import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Header } from 'components'
import { Radio, Stack, Text } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import { useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { ITransactions } from 'utils'

type Props = NativeStackScreenProps<RootStackParamList, 'edit_transaction', 'Stack'>

const EditTransaction = ({ route }: Props) => {
    const router = useNavigation()
    const { transactionId } = route.params
    const [loading, setLoading] = useState(false)
    const [transactionName, setTransactionName] = useState('')
    const [transactionAmount, setTransactionAmount] = useState('')
    const [linkId, setLinkId] = useState<string | number>('')
    const [fee, setFee] = useState(0)
    const [status, setStatus] = useState('')

    useEffect(() => {
        if (transactionId) {
            firestore()
                .collection('transactions')
                .doc(transactionId)
                .get()
                .then(document => {
                    if (document.exists) {
                        const data = document.data() as ITransactions
                        if (data) {
                            setTransactionAmount((data.transactionAmount - data.transactionFee).toString())
                            setTransactionName(data.transactionName)
                            setLinkId(data.link_id)
                            setStatus(data.transactionStatus)
                            setFee(data.transactionFee)
                        }
                    }
                })
        }
    }, [transactionId])

    const handleChangeAmount = (text: string) => {
        if (text.length === 0) {
            setTransactionAmount('')
        } else {
            const number = Number(text)
            if (number > 0) {
                setTransactionAmount(number.toString())
            }
            if (text) {
                // accept only number
                if (text !== '' && text.match(/^[0-9]*$/)) {
                    const value = text
                    if (value) {
                        if (Number(value) > 0) {
                            const fees = 10000
                            if (Number(value) <= 5000000) {
                                setFee(fees)
                            } else {
                                const realFee = Number(value) / 5000000
                                setFee(Math.ceil(realFee) * fees)
                            }
                            // props.onClick(transactions)
                        }
                    }
                }
            } else {
                // props.onClick()
            }
        }
    }

    const handleSave = () => {
        setLoading(true)
        if (transactionId) {
            firestore()
                .collection('transactions')
                .doc(transactionId)
                .update({
                    transactionName,
                    transactionAmount: Number(transactionAmount) + fee,
                    transactionFee: fee,
                    transactionStatus: status,
                })
                .then(() => {
                    setLoading(false)
                    router.goBack()
                })
                .catch(error => {
                    alert(error.message)
                    setLoading(false)
                })
        }
    }

    return (
        <View>
            <StatusBar />
            <Header
                title={'Edit Transaksi'}
                extraHeader={<></>}
            />
            <View
                style={{
                    marginTop: 10,
                    padding: 10,
                }}>
                <TextInput
                    value={transactionName}
                    onChangeText={text => setTransactionName(text)}
                    placeholder={'Nama Transaksi'}
                />
                <Stack
                    my={'5'}
                    alignItems={'center'}
                    alignContent={'center'}>
                    <Radio.Group
                        onChange={nextValue => setStatus(nextValue)}
                        value={status}
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
                <TextInput
                    style={{
                        marginTop: 10,
                    }}
                    keyboardType={'numeric'}
                    value={transactionAmount}
                    onChangeText={handleChangeAmount}
                    placeholder={'Jumlah Transaksi'}
                />
                <TextInput
                    style={{
                        marginTop: 10,
                    }}
                    disabled={true}
                    value={fee.toString()}
                    placeholder={'Biaya'}
                />
                <Button
                    mode={'contained'}
                    loading={loading}
                    disabled={loading}
                    style={{
                        marginTop: 10,
                    }}
                    onPress={handleSave}>
                    Simpan
                </Button>
            </View>
        </View>
    )
}

export { EditTransaction }

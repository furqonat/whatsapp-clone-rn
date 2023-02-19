import { Ionicons } from '@expo/vector-icons'
import firestore from '@react-native-firebase/firestore'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ButtonPrimary, InputPrimary } from 'components'
import { IconButton } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import { useState } from 'react'
import { ScrollView, StatusBar, Text, View } from 'react-native'
import { useFirebase } from 'utils'

type Props = NativeStackScreenProps<RootStackParamList, 'refund'>

const Refund = ({ route }: Props) => {
    const [reason, setReason] = useState('')

    const { user } = useFirebase()

    const handleRefund = () => {
        // const docRef = doc(db, 'transactions', route.params.transactionId)
        // const refundRef = doc(db, 'refunds', route.params.transactionId)
        // const userRef = query(collection(db, 'users'), where('phoneNumber', '==', user?.phoneNumber))
        firestore()
            .collection('transactions')
            .doc(route.params.transactionId)
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
                            // return
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
                                                .doc(route.params.transactionId)
                                                .set({
                                                    reason,
                                                    createdAt: new Date().getTime(),
                                                    bankName: data?.bankName,
                                                    bankAccount: data?.bankAccount,
                                                    bankAccountName: data?.bankAccountName,
                                                    orderId: route.params.transactionId,
                                                    status: false,
                                                })
                                                .then(() => {})
                                        }
                                    })
                            })
                        }
                    })
            })
        /* updateDoc(docRef, {
            status: 'refund',
        }).then(() => {
            getDocs(userRef).then(querySnapshot => {
                if (querySnapshot.empty) {
                    // return
                } else {
                    querySnapshot.forEach(docData => {
                        const ref = doc(db, 'users', `${docData.id}`, 'verification', `${user?.phoneNumber}`)
                        getDoc(ref).then(document => {
                            if (document.exists()) {
                                const data = document.data()
                                setDoc(refundRef, {
                                    reason,
                                    createdAt: new Date().getTime(),
                                    bankName: data?.bankName,
                                    bankAccount: data?.bankAccount,
                                    bankAccountName: data?.bankAccountName,
                                    orderId: route.params.transactionId,
                                    status: false,
                                }).then(() => {})
                            }
                        })
                    })
                }
            })
        })*/
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
                        // onPress={handleBack}
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
                        Pengajuan refund
                    </Text>
                </View>
            </View>
            <ScrollView>
                <View
                    style={{
                        width: '100%',
                        marginBottom: 20,
                    }}>
                    <View
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            alignContent: 'center',
                            marginTop: 20,
                        }}>
                        <InputPrimary
                            value={reason}
                            onChangeText={setReason}
                            height={100}
                            multiline={true}
                            textAlignVertical={'top'}
                            title={'Alasan refund'}
                            placeholder={'Masukan alasan refund'}
                        />

                        <ButtonPrimary
                            // onPress={handleSave}
                            onPress={handleRefund}
                            title={'Selesai'}
                            px={12}
                            py={'35%'}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export { Refund }

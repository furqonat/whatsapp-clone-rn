import { Ionicons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useContacts, useTransactions } from 'hooks'
import { IconButton, Menu, Pressable, Stack, StatusBar, Text, VStack } from "native-base"
import { RootStackParamList } from "pages/screens"
import { useMemo, useRef, useState } from "react"
import { IContact, ITransactions, useFirebase } from "utils"
import { ContactList } from '../chats/contact-list'
import { TransactionItem } from './transaction-item'
import { TransactionList } from './transaction-list'

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin'>

const Transaction = () => {

    const navigation = useNavigation<signInScreenProp>()

    const { logout, user } = useFirebase()
    const { contacts } = useContacts({
        user: user
    })

    const { transactions } = useTransactions({
        userId: user?.uid
    })

    const bsRef = useRef<BottomSheet>(null)
    const bsRefItem = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], [])


    const [trans, setTrans] = useState<ITransactions | null>(null)


    const handleClose = () => {
        logout().then(_ => {
            navigation.navigate('signin')
        })
    }

    const handleOnContactPress = (item: IContact) => {
        bsRef.current?.close()
        navigation.navigate('new_transaction', {
            contact: item
        })
    }

    const handleOnItemPress = (item: ITransactions) => {
        bsRef.current?.close()
        bsRefItem.current?.expand()
        setTrans(item)
    }

    const handleOpen = () => {
        bsRef.current?.expand()
    }

    return (
        <Stack direction={'column'}>
            <StatusBar backgroundColor={'#5b21b6'} />
            <Stack
                display={'flex'}
                flexDirection={'column'}
                h={'100%'}>
                <Stack
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    width={'100%'}
                    p={5}
                    shadow={2}
                    backgroundColor={'violet.800'}
                    direction={'row'}>
                    <Stack>
                        <Text
                            color={'white'}
                            fontSize={20}
                            bold={true}>
                            Transaksi
                        </Text>
                    </Stack>

                    <Stack
                        left={3}
                        justifyItems={'center'}
                        direction={'row'}
                        space={1}>
                        <IconButton
                            borderRadius='full'
                            onPress={handleOpen}
                            _icon={{
                                as: Ionicons,
                                name: 'add-outline',
                                color: 'white',
                                size: '5',
                            }} />
                        <Menu
                            backgroundColor='white'
                            shadow={2}
                            trigger={triggerProps => {
                                return (
                                    <Pressable accessibilityLabel='More options menu'>
                                        <IconButton
                                            {...triggerProps}
                                            borderRadius='full'
                                            _icon={{
                                                as: Ionicons,
                                                name: 'ellipsis-vertical',
                                                color: 'white',
                                                size: '5',
                                            }}
                                        />
                                    </Pressable>
                                )
                            }}>
                            <Menu.Item
                                onPress={handleClose}>
                                <Text>Keluar</Text>
                            </Menu.Item>
                        </Menu>
                    </Stack>
                </Stack>
                <TransactionList
                    transactions={transactions}
                    onPress={handleOnItemPress} />
                <BottomSheet
                    index={-1}
                    ref={bsRefItem}
                    enablePanDownToClose={true}
                    animateOnMount={true}
                    snapPoints={snapPoints}>
                    {
                        trans && (
                            <TransactionItem
                                transaction={trans} />
                        )
                    }
                </BottomSheet>
                <BottomSheet
                    index={-1}
                    animateOnMount={true}
                    enablePanDownToClose={true}
                    ref={bsRef}
                    snapPoints={snapPoints}>
                    <BottomSheetFlatList
                        data={contacts}
                        keyExtractor={item => item.uid}
                        renderItem={({ item }) => {
                            return (
                                <VStack
                                    p={2}>
                                    <ContactList item={item} onPress={handleOnContactPress} />
                                </VStack>
                            )
                        }}
                    />
                </BottomSheet>
            </Stack>

        </Stack>
    )
}

export { Transaction }


import { Box, FlatList, Text, Stack, Avatar } from "native-base"
import { Touchable } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { ITransactions } from "utils"


const TransactionList = (props: {
    transactions?: ITransactions[] | null,
    onPress?: (item: ITransactions) => void
}) => {

    return (
        <FlatList
            data={props.transactions}
            renderItem={({ item }) => {
                return (
                    <Item
                        onPress={props.onPress}
                        transaction={item}
                        activeChat={false} />
                )
            }}
            keyExtractor={item => item.id} />

    )
}

const Item = (props: {
    transaction: ITransactions,
    activeChat: boolean,
    onPress?: (transaction: ITransactions) => void,
}) => {

    const getStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'Aktif'
            case 'pending':
                return 'Pending'
            case 'settlement':
                return 'Sukses'
            case 'expire':
                return 'Kadaluarsa'
            default:
                return 'Aktif'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'blue'
            case 'pending':
                return 'yellow'
            case 'settlement':
                return 'green'
            case 'expire':
                return 'red'
            default:
                return 'blue'
        }
    }

    return (
        <TouchableOpacity
            onPress={() => {
                props.onPress && props.onPress(props.transaction)
            }}>
            <Box
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                px={2}>
                <Stack direction={'row'} alignItems={'center'} space={2} py={2}>
                    <Avatar />
                    <Stack space={0} direction={'column'}>
                        <Text variant={'sm'}>
                            {
                                props.transaction.transactionName?.toString()
                            }
                        </Text>
                        <Text variant={'body2'}>

                            {
                                Number(props.transaction.transactionAmount).toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                })
                            }

                        </Text>
                    </Stack>
                </Stack>
                <Text
                    color={
                        getStatusColor(props.transaction?.status)
                    }
                    variant={'body2'}>{getStatus(props?.transaction?.status)}</Text>
            </Box>
        </TouchableOpacity>
    )
}
export { TransactionList }
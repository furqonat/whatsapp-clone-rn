import moment from "moment"
import { Box, FlatList, Stack, Text } from "native-base"
import { Image, ScrollView, TouchableOpacity } from "react-native"
import { } from "react-native-gesture-handler"
import { ITransactions } from "utils"

import React from "react"


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

    const getLogos = () => {
        // E-wallet
        if (payment_type == 'gopay') {
            return 'https://payment.tiketux.com/image/payment_v2/gopay.png'
        } else if (payment_type == 'shopeepay') {
            return 'https://1.bp.blogspot.com/-EmJLucvvYZw/X0Gm1J37spI/AAAAAAAAC0s/Dyq4-ko9Eecvg0ostmowa2RToXZITkbcQCLcBGAsYHQ/s400/Logo%2BShopeePay.png'
        } else if (payment_type == 'akulaku') {
            return 'https://images.bisnis.com/posts/2022/04/02/1518155/paylater.jpg'
        } else if (payment_type == 'alfamart-01') {
            return 'https://1.bp.blogspot.com/-_Y43MBWFCpo/XpSayUh01BI/AAAAAAAAE60/_tocLpo1vs8MRPabEdeHfQ4zVucL8298QCLcBGAsYHQ/s1600/alfa_group.jpg'
        }
        else if (payment_type == 'danamon_online') {
            return 'https://www.dutapay.co.id/images/dutapay/logo-danamononlinebanking.jpg'
        } else if (payment_type == 'bca_klikpay') {
            return 'data:image/png;base64,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'
        } else if (payment_type == 'cimb_clicks') {
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAABUFBMVEX////lJjX8/////v/5///+/vzjJzX8/v/nJTX//f/3///9//zjUVzkHizlJzT//v1oAADkAB5uAAD0ys14AAByAADnJjJiAADkABiDISGkaWreysjhKTPjJzjkABJnAADt5ePRuLf49PTjhIjstLbmFybmR1HlGCjv//+/mZT16Ojq0tb47e7v19rnp6nlZmzrvb/ie3/gOkjfb3nqZG7df4XjMD/gX2PljZLjSU/jLEHoqqvmnJvug47qm6X09e7tAADqa3rkeX314Nr23+PjiIbsx8ThSVzmu7riAADmn57WRlDgdnTibW/op6DwmZyrfn6ld3OSWFaDCxyQSUXIpKbZXG6hY2DcxcisjIV6FyPvEjB1FRR/LCqNOELaCRm9jIrFraXJrKXXvMGDAACiVluRZmKdPT3Scm+IQT7b1tHJFhyzExu2ipWnZW+oc3mQssXWAAAM+klEQVR4nO2b+0Pb1hXHr4+unpcrWcIWrm05skAIG5sQkqbksSiFjGTZsjgUFmgeJXTZBlvH///bzr0yhLTZfkoHoeeTgG294H593jKMEQRBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEFcPMPBbYJ7bop+bBjOD6jXudIGB+ctzGbgAeAAEoF7gtfBA9qkDrwiGYQoALxsuLy8PM3wquB2YhisEcHc0xo0jwT3bNDzP4xw+QoAHSjAOdpaNMpuDEKZwL3pJvyKoQLpyPWm1WmGYPHs6BMGCwBA8W72xFvZws7yzPgYu5mc+xbwJfLhyc03mRXdxY2EElZVdUVCV9TgspGNZjpRFK15PubKqhcUw9y3HSmqxzFvXx96tXi5/QbiWlV/LH/I4Vq/yMFlPPfuil/RrIRhfvR3GllWLHaeW1PAxvL3Avc1vQplYtZqPe1DGJC/Ws43Q8ZH4DD9O5B2x3pI1PAr/4/lxePcegCmMi17Y58cQgXe/KCwHRarp5dbirhUX9721PO76NbWx+ub4+a3ydy3UTm+Y4nflonez8KtTa76PW+L8a7Hkiote2q8A9573HKuSpQKdseb0HpQyduJTAZGu080fe9fz2kdq+d1i0ftWnm5Rl7Fi+eq6sK+gWIIttLQ8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'
        } else if (payment_type == 'bca_klikbca') {
            return 'data:image/png;base64,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'
        } else if (payment_type == 'Indomaret') {
            return 'https://payment.tiketux.com/image/payment_v2/indomaret-isaku-2.png'
        } else {
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKb_PcaY7Yp3QvY9dFfEySvTj9qyWnqNR2LA&usqp=CAU'
        }
    }



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



    return (
        <ScrollView>
            <TouchableOpacity
                onPress={() => {
                    props.onPress && props.onPress(props.transaction)
                }}>

                {

                }
                <Box
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    backgroundColor={'white'}
                    px={2}
                    py={2}>
                    <Stack direction={'row'} alignItems={'center'} space={2} py={2} >
                        <Image style={{ height: 40, width: 60, }} source={{ uri: `${getLogos()} ` }} />
                        <Stack space={0} direction={'column'} >
                            <Text bold={true} variant={'sm'}>
                                {
                                    props.transaction.transactionName?.toString()
                                }
                            </Text>
                            <Text color={'gray.400'}>
                                {moment(createdAt).format('DD MMMM YYYY')}
                            </Text>

                        </Stack>
                    </Stack>
                    <Stack display={'flex'} >
                        {/* <Text color={'gray.600'} variant={'body2'}> Rp&nbsp;

                            
                                // Number(props.transaction.transactionAmount).toLocaleString('id-ID', {
                                //     style: 'currency',
                                //     currency: 'IDR'
                                // })
                                
                            

                        </Text> */}

                        <Text
                            textAlign={'right'}
                            color={
                                getStatusColor(props.transaction?.status)
                            }
                            variant={'body2'}>{getStatus(props?.transaction?.status)}</Text>
                    </Stack>

                </Box>
            </TouchableOpacity>
        </ScrollView>

    )
}
export { TransactionList }

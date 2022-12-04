import moment from "moment"
import { Button, Divider, Stack, Text, View } from "native-base"
import React, { useState } from "react"
import { ITransactions, useFirebase } from "utils"
import * as WebBrowser from 'expo-web-browser';
import * as Clipboard from 'expo-clipboard';

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

    const openInNewTab = (url: string) => {
        WebBrowser.openBrowserAsync(url).then(_ => {})
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
                                color={status === 'ACTIVE' || status === 'settlement' ? 'green' : 'yellow'}
                                variant={'sm'}>
                                {status} &nbsp;
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
                                    color={transactionStatus === 'legal' ? 'green' : 'red'}
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
                                status !== 'ACTIVE' && status !== 'settlement' ? (
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
                                )
                            }
                        </Stack>
                    </Stack>
                </View>
            </Stack>
        </Stack>
    )
}

export { TransactionItem }
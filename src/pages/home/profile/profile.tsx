import { View, Text } from 'react-native'
import React from 'react'
import { Button, Image, Input, Stack } from 'native-base'

const Profile = () => {
    return (
        <Stack
            top={8}
            h={'100%'}>
            <Stack alignItems={'center'}>
                <Image
                    size={'xl'}
                    borderRadius={100}
                    borderColor={'black'}
                    src={`https://avatars.dicebear.com/api/avataaars/${Date.now()}.png`}
                    alt={' '}
                    mb={'8'}
                />
            </Stack>
            <Stack
                space={4}
                w='75%'
                maxW='300px'
                mx='auto'>
                <Input
                    fontSize={'md'}
                    variant='underlined'
                    placeholder='Nama'
                />
                <Input
                    fontSize={'md'}
                    variant='underlined'
                    placeholder='Email'
                />
                <Input
                    fontSize={'md'}
                    variant='underlined'
                    placeholder='No KTP'
                    keyboardType='numeric'
                />
                <Input
                    fontSize={'md'}
                    variant='underlined'
                    placeholder='Alamat'
                />
                <Button>Simpan</Button>
            </Stack>
        </Stack>
    )
}

export { Profile }

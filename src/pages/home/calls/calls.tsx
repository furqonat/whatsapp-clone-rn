import { useCall } from 'hooks'
import { Stack, StatusBar, Text } from 'native-base'
import { useFirebase } from 'utils'

import { CallList } from './call-list'

const Calls = () => {
    const { user } = useFirebase()
    const { calls } = useCall({
        user,
    })
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
                    p={'5'}
                    shadow={2}
                    backgroundColor={'violet.800'}
                    direction={'row'}>
                    <Stack>
                        <Text
                            color={'white'}
                            fontSize={20}
                            bold={true}>
                            Panggilan
                        </Text>
                    </Stack>

                    <Stack
                        left={3}
                        justifyItems={'center'}
                        direction={'row'}
                        space={1}></Stack>
                </Stack>
                <CallList calls={calls} />
            </Stack>
        </Stack>
    )
}

export { Calls }

import { useCall } from 'hooks'
import { Stack } from 'native-base'
import { useFirebase } from 'utils'

import { CallList } from './call-list'

const Calls = () => {
    const { user } = useFirebase()
    const { calls } = useCall({
        user,
    })
    return (
        <Stack direction={'column'}>
            <CallList calls={calls} />
        </Stack>
    )
}

export { Calls }

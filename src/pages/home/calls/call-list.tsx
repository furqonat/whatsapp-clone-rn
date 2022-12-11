import { useContact, useUserInfo } from "hooks"
import moment from "moment"
import { Avatar, IconButton, Stack, Text } from "native-base"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Chip } from "react-native-paper"
import { ICall, useFirebase } from "utils"

interface ICallGroup extends ICall {
    length: number,
    calls?: ICall[]
}


const CallList: React.FC<{
    calls: ICall[],
    onClick?: (info: string) => void,
    filterOptions?: string,
    innerCalls?: (calls?: ICall[]) => void
}> = (props) => {

    const [selected, setSelected] = useState<string | null>(null)

    const groupCalls = (calls: ICall[]) => {
        const callGroups: ICallGroup[] = []
        let callGroup: ICallGroup | null = null
        for (let i = 0; i < calls.length; i++) {
            const call = calls[i]
            if (callGroup) {
                const previousCall = calls[i - 1]
                const diff = moment(previousCall.time).diff(moment(call.time), 'minutes')
                if (diff <= 2 && call.callType === previousCall.callType && call.phoneNumber === previousCall.phoneNumber) {
                    callGroup.length += 1
                    callGroup?.calls?.push(call)
                } else {
                    callGroups.push(callGroup)
                    callGroup = {
                        ...call,
                        length: 1,
                        calls: [call]
                    }
                }
            } else {
                callGroup = {
                    ...call,
                    length: 1,
                    calls: [call]
                }
            }
        }
        if (callGroup) {
            callGroups.push(callGroup)
        }
        return callGroups
    }


    return (
        <Stack
            display={'flex'}
            flexDirection={'column'}>
            <FlatList
                data={groupCalls(props.calls)}
                renderItem={(item: { item: ICallGroup }) => (
                    <Item
                        key={item.item.callId}
                        call={item.item}
                        selected={selected !== null && selected === item.item.callId}
                        onSelect={(event: string) => {
                            setSelected(event)
                        }}
                        filters={props.filterOptions}
                        onClick={(event: string) => {
                            props.onClick && props.onClick(event)
                            props.innerCalls && props.innerCalls(item.item?.calls)
                        }} />
                )}>
            </FlatList>
        </Stack>
    )
}


const Item: React.FC<{
    call: ICallGroup,
    onSelect: (data: string) => void,
    onClick: (data: string) => void,
    filters?: string,
    selected?: boolean
}> = (props) => {

    const { call, onClick, onSelect, selected, filters } = props
    const { user } = useFirebase()
    const { contact } = useContact({ user: user, contactId: user?.uid === call.caller.uid ? call.receiver.uid : call.caller.uid })
    const { userInfo } = useUserInfo({
        phoneNumber: user?.uid === call.caller.uid ? call.receiver.phoneNumber : call.caller.phoneNumber
    })

    const getOwnerDisplayNameOrPhoneNumber = () => {
        if (contact) {
            return contact.displayName
        } else {
            if (call.phoneNumber === user?.phoneNumber) {
                return call.receiver.phoneNumber
            }
            return call.phoneNumber
        }
    }


    const getCallIcon = () => {
        switch (call.status) {
            case "unanswered":
                if (call.phoneNumber !== user?.phoneNumber) {
                    return "call-missed"
                } else {
                    return "call-made"
                }
            default:
                if (call.phoneNumber !== user?.phoneNumber) {
                    return "call-received"
                } else {
                    return "call-made"
                }
        }
    }

    const filterOptions = () => {
        if (filters) {
            if (getOwnerDisplayNameOrPhoneNumber()?.toLowerCase().includes(filters.toLowerCase())) {
                return 'flex'
            }
            return 'none'
        }
        return 'flex'
    }


    return (

        <TouchableOpacity>
            <Stack
                display={filterOptions()}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                px={2}
                space={2}>
                <Stack direction={'row'} alignItems={'center'} space={2} py={2}>
                    <Avatar
                        source={{
                            uri: userInfo?.photoURL ? userInfo?.photoURL : ""
                        }} />
                    <Stack
                        space={2}
                        direction={'column'}>
                        <Text variant={'lg'}>
                            {
                                getOwnerDisplayNameOrPhoneNumber()
                            }
                        </Text>
                        <Text variant={'sm'}>
                            <Stack direction={'row'} space={2} justifyItems={'center'}>
                                <Chip
                                    icon={getCallIcon()}>
                                    {moment(call.time).format('hh:mm A')}
                                </Chip>
                                {
                                    call.length > 1 &&
                                    <Chip>
                                        {`${call.length} panggilan`}
                                    </Chip>

                                }
                            </Stack>
                        </Text>
                    </Stack>
                </Stack>
                {
                    call.callType === 'video' ? (
                        <IconButton
                            name="video">
                        </IconButton>
                    ) : (
                        <IconButton
                            name={'phone'}>
                        </IconButton>
                    )
                }
            </Stack>
        </TouchableOpacity>
    )
}

export { CallList }

import { useContact, useUserInfo } from "hooks"
import moment from "moment"
// import { Avatar, IconButton, Stack, Text } from "native-base"
import React, { useState } from "react"
import { FlatList, Image, View, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Chip, IconButton } from "react-native-paper"
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
        <View
            style={{
                display:'flex',
                flexDirection:'column'
            }}>
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
        </View>
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
            <View
                style={{
                    display: 'flex',
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'space-between',
                    padding:10
                }}>
                <View style={{
                    flexDirection:'row',
                    alignItems:'center',
                    paddingVertical:2
                }}>
                    <Image
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 100,
                            marginRight:10
                        }}
                        source={{
                            uri: userInfo?.photoURL ? userInfo?.photoURL : undefined
                        }} />
                    <View
                        style={{
                            flexDirection:'column',
                        }}>
                        <Text >
                            {
                                getOwnerDisplayNameOrPhoneNumber()
                            }
                        </Text>
                        <Text >
                            <View style={{
                    flexDirection:'row',
                    justifyContent:'center',
                    
                }}  >
                                <Chip
                                    icon={getCallIcon()}>
                                    {moment(call.time).format('hh:mm A')}
                                </Chip>

                                
                            </View>
                        </Text>
                    </View>
                </View>
                {/* {
                    call.callType === 'video' ? (
                        <IconButton
                            name="video">
                        </IconButton>
                    ) : (
                        <IconButton
                            name={'phone'}>
                        </IconButton>
                    )
                } */}
            </View>
        </TouchableOpacity>
    )
}

export { CallList }

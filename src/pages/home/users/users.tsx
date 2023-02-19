import firestore from '@react-native-firebase/firestore'
import { Header } from 'components'
import { useEffect, useState } from 'react'
import { FlatList, StatusBar, Text, View } from 'react-native'
import { Chip } from 'react-native-paper'
import { IUser } from 'utils'

const Users = () => {
    const [users, setUsers] = useState<IUser[]>([])
    useEffect(() => {
        return firestore()
            .collection('users')
            .where('status', '==', 'online')
            .onSnapshot(querySnapshot => {
                const users: IUser[] = []
                querySnapshot.forEach(documentSnapshot => {
                    users.push(documentSnapshot.data() as IUser)
                })
                setUsers(users)
            })
    }, [])
    return (
        <View>
            <StatusBar />
            <Header title={'Aktif Users'} />
            <FlatList
                data={users}
                renderItem={item => (
                    <View
                        style={{
                            backgroundColor: 'white',
                            margin: 10,
                            padding: 10,
                            borderRadius: 10,
                        }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'black',
                                padding: 5,
                            }}>
                            {item.item.displayName}
                        </Text>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                            }}>
                            <Chip>{item.item.phoneNumber}</Chip>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

export { Users }

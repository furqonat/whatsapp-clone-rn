import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Button, Image, Modal, Stack, Text } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import React, { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Colors, Dialog, IconButton } from 'react-native-paper'
import { useFirebase, USER_KEY } from 'utils'

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin' | 'chatItem' | 'qr'>

type HeaderProps = {
    title?: string
    extraHeader?: React.ReactNode
}
export const Header: React.FC<HeaderProps> = props => {
    const { title = 'Rekberin' } = props
    const navigation = useNavigation<signInScreenProp>()
    const [showModal, setShowModal] = useState(false)
    const { logout, setValue } = useFirebase()
    const [loading, setLoading] = useState(false)
    const logoutApp = () => {
        setLoading(true)
        setShowModal(false)
        setValue(USER_KEY, JSON.stringify('no'))
            .then(_ => {
                logout().then(() => {
                    setLoading(false)
                    navigation.navigate('signin')
                })
            })
            .catch(error => {
                alert(error.message)
            })
    }
    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: 15,
                shadowOpacity: 2,
                backgroundColor: '#5b21b6',
                flexDirection: 'row',
            }}>
            <View>
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}>
                    {title}
                </Text>
            </View>

            {props.extraHeader ? (
                props.extraHeader
            ) : (
                <>
                    <View
                        style={{
                            left: 3,
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}>
                        <IconButton
                            icon='logout'
                            color={Colors.white}
                            size={23}
                            onPress={() => setShowModal(true)}
                        />
                        <Modal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            _backdrop={{
                                _dark: {
                                    bg: 'white',
                                },
                                bg: 'gray.700',
                            }}>
                            <Modal.Content
                                alignItems={'center'}
                                py={4}
                                maxWidth='350'
                                maxH='212'>
                                <Image
                                    size={20}
                                    source={require('../assets/adaptive-icon.png')}
                                    alt='logo'
                                />
                                <Text style={{ fontSize: 18, marginBottom: 15 }}>Yakin mau keluar?</Text>
                                <Stack
                                    space={30}
                                    direction={'row'}>
                                    <Button
                                        onPress={() => {
                                            setShowModal(false)
                                        }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant='outline'
                                        colorScheme='secondary'
                                        onPress={logoutApp}>
                                        Yes
                                    </Button>
                                </Stack>
                            </Modal.Content>
                        </Modal>
                    </View>
                    <Dialog
                        dismissable={false}
                        visible={loading}>
                        <Dialog.Content>
                            <ActivityIndicator
                                size='large'
                                color={Colors.blue500}
                            />
                        </Dialog.Content>
                    </Dialog>
                </>
            )}
        </View>
    )
}

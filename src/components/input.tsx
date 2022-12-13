import React from 'react'
import { Text, TextInput, View } from 'react-native'

const InputPrimary = (props: any) => {
    return (
        <View style={{

            alignItems: 'center',
            width: '80%',

        }}>
            <Text style={{
                alignSelf: 'flex-start',
                left: 15,
                color: '#3b5998'
            }}>{props.tittle}</Text>
            <TextInput
                value={props.value}
                style={{
                    height: 50,
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                    borderColor: '#3b5998',
                    borderWidth: 1,
                    width: '100%'



                }}
                editable={!props.disabled}
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}

            />
        </View>
    )
}

export { InputPrimary }

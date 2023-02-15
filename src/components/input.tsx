import React from 'react'
import { Text, TextInput, View } from 'react-native'

const InputPrimary = (props: any) => {
    return (
        <View style={{

            alignItems: 'center',
            width: '80%',

        }}>
            <Text
                style={{
                alignSelf: 'flex-start',
                left: 15,
                color: '#3b5998'
            }}>{props.title}</Text>
            <TextInput
                keyboardType={props.keyboardType}
                value={props.value}
                style={{
                    height: props.height ? props.height : 50,
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                    borderColor: '#3b5998',
                    borderWidth: 1,
                    width: '100%',
                }}
                multiline={props.multiline}
                textAlignVertical={props.textAlignVertical}
                editable={!props.disabled}
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}
                onPressIn={props.onPress}
            />
        </View>
    )
}

export { InputPrimary }

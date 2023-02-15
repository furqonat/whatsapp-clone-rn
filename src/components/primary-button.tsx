import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

const ButtonPrimary = (props: any) => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress} style={{
      elevation: 8,
      backgroundColor: "#3b5998",
      borderRadius: 18,
      paddingVertical: props.px,
      paddingHorizontal: props.py,
      justifyContent: 'center',
      marginTop: 20,
      alignItems: 'center'
    }}>
      <Text style={{ color: 'white', fontSize: 18 }}>{props.title}</Text>

    </TouchableOpacity>
  )
}


export { ButtonPrimary }
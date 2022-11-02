
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Center, IconButton, ScrollView, Stack, VStack, Text, StatusBar, Avatar } from 'native-base'
import { AntDesign, Ionicons } from "@expo/vector-icons";
import sizes from 'native-base/lib/typescript/theme/base/sizes';
import { TouchableOpacity } from 'react-native';

const Chats = () => {
  return (
    <SafeAreaView style={{backgroundColor:'white'}} >
      <StatusBar backgroundColor='#5b21b6' />
      <Stack>
        <VStack bottom={2} h={70} alignItems="center" justifyContent='space-between' backgroundColor='violet.800' direction="row" mb="2.5" mt="1.5"  >
          <Stack left={10}>
            <Text color='white' fontSize={20} bold >Rekberin</Text>
          </Stack>

          <Stack direction="row">
            <IconButton borderRadius='full' _icon={{
              as: AntDesign,
              name: "search1",
              color: 'white',
              size: '5'
            }} />
            <IconButton borderRadius='full' _icon={{
              as: Ionicons,
              name: "ellipsis-vertical",
              color: 'white',
              size: '5'
            }} />
          </Stack>

        </VStack>
        <ScrollView>
          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text bold fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }} >
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text bold  fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text bold fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text bold fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              }} />
              <Stack>
              <Text bold fontSize={15}>Alex</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text bold fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text bold  fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text bold fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 6, backgroundColor:'white' }}>
            <Stack direction="row" h={20} alignItems='center' space={10} >
              <Avatar left={5} bg="green.500" source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }} />
              <Stack>
              <Text fontSize={15}>Jaka Tarub</Text>
              <Text color='amber.400'>hallo</Text>
              </Stack>
            </Stack>
          </TouchableOpacity>

          
        </ScrollView>

      </Stack>
    </SafeAreaView>
  )
}

export { Chats }
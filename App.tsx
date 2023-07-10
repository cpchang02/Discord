import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';

import {StreamChat} from 'stream-chat';
import { useEffect, useState } from 'react';
import {
  OverlayProvider, 
  Chat, 
  ChannelList, 
  Channel, 
  MessageList,
  MessageInput} from "stream-chat-expo";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthContext from './src/contexts/AuthContext';

const API_KEY = "65vsq6nxx8w5";
const client = StreamChat.getInstance(API_KEY)

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [selectedChannel, setSelectedChannel] = useState(null);
  
  useEffect(()=>{
    //component mounts
    return () =>{
      //when component unmounts
      client.disconnectUser();
    };

  }, []);
 
  const onChannelSelect = (channel) =>{
    setSelectedChannel(channel);
  };

  if (!isLoadingComplete){
    return null;
  } else {
    return <GestureHandlerRootView style = {{flex: 1}}>{
    ( 
    
    <SafeAreaProvider>
      <AuthContext>
      <OverlayProvider>
        <Chat client={client}>
          <Navigation colorScheme={colorScheme} /> 
          {/* if a channel is selected, change to the channel screen */}
          {/* {!selectedChannel ? (
          <ChannelList onSelect = {onChannelSelect} />
          ) : (
            <>
              <Channel channel = {selectedChannel}>
                <Text 
                  style = {{margin: 50}}
                  onPress = {() => setSelectedChannel(null)}>
                Go Back
                </Text>
                <MessageList />
                <MessageInput />
              </Channel>
            </>
            )} */}
        </Chat>
      </OverlayProvider>
      </AuthContext>
      <StatusBar style = "light"/>
    </SafeAreaProvider>
  
    )}</GestureHandlerRootView>;
  }
}

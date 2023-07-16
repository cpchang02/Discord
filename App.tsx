import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './src/hooks/useCachedResources';
import Navigation from './src/navigation';
import {StreamChat} from 'stream-chat';
import { useEffect, useState } from 'react';
import { OverlayProvider, Chat, Theme, DeepPartial} from "stream-chat-expo";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthContext from './src/contexts/AuthContext';
import { StreamColors } from './src/constants/Colors';

const API_KEY = "65vsq6nxx8w5";
const client = StreamChat.getInstance(API_KEY)

const theme: DeepPartial<Theme> = {
  colors: StreamColors
};
export default function App() {
  const isLoadingComplete = useCachedResources();

  
  useEffect(()=>{
    //component mounts
    return () =>{
      //when component unmounts
      client.disconnectUser();
      console.log("creating new user");

    };

  }, []);
 


  if (!isLoadingComplete){
    return null;
  } else {
    return <GestureHandlerRootView style = {{flex: 1}}>{
    ( 
    
    <SafeAreaProvider>
      <AuthContext>
      <OverlayProvider value = {{style:theme}}>
        <Chat client={client}>
          <Navigation colorScheme={"dark"} /> 
        </Chat>
      </OverlayProvider>
      </AuthContext>
      <StatusBar style = "light"/>
    </SafeAreaProvider>
  
    )}</GestureHandlerRootView>;
  }
}

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
import {Amplify} from "aws-amplify";
import awsconfig from './src/aws-exports';
import {
  withAuthenticator, Auth
} from '@aws-amplify/ui-react-native';


Amplify.configure(awsconfig);

const API_KEY = "65vsq6nxx8w5";
const client = StreamChat.getInstance(API_KEY)

const theme: DeepPartial<Theme> = {
  colors: StreamColors
};

function App() {
  const isLoadingComplete = useCachedResources();
  
  const fetchUser = async() => {
    const userDat = await Auth.currentAuthenticatedUser();
    console.log(userData);
  }
  useEffect(()=>{
    //component mounts
    return () =>{
      //when component unmounts
      console.log(client.user);
      client.disconnectUser();

    };
  }, []);
 


  if (!isLoadingComplete){
    return null;
  } else {
    return <GestureHandlerRootView style = {{flex: 1}}>{
    ( 
    
    <SafeAreaProvider>
      <AuthContext client = {client}>
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
export default withAuthenticator(App);
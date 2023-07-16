import { View, Text, StyleSheet } from "react-native";
import React from 'react';
import { useRoute, useNavigation } from "@react-navigation/native";
import { Channel, MessageList, MessageInput, ChannelAvatarWithContext } from "stream-chat-expo";
import ChannelScreen2 from "./ChannelScreen2";
import Colors, { StreamColors } from "../constants/Colors";
const ChannelScreen = () =>{

    const route = useRoute();
    const navigation = useNavigation();
    const channel  = route.params?.channel;

    navigation.setOptions({title: channel?.data?.name||"Channel" });

    if(!channel){
        return (
        <View >
            <Text style = {styles.errorText}>Select a channel</Text>
        </View>
        );
    }
    return(
        <View style = {styles.testing}>
            <Channel channel = {channel} 
            key = {channel.data.name}
            forceAlignMessages= "left">
            <MessageList />
            <MessageInput />
            </Channel>
        </View>
        

        

    );
};

const styles = StyleSheet.create(
    
    {
    testing:{
        backgroundColor: "white",
    }
    ,
    errorContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,

    },
    errorText:{
        color: "white",
        fontSize: 16,
    },
    test:{
        color: "white",
        fontsize: 20.
    },
   
});
export default ChannelScreen;
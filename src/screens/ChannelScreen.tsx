import { View, Text, StyleSheet } from "react-native";
import React from 'react';
import { useRoute, useNavigation } from "@react-navigation/native";
import { Channel, MessageList, MessageInput} from "stream-chat-expo";
const ChannelScreen = () =>{

    const route = useRoute();
    const navigation = useNavigation();
    const channel  = route.params?.channel;


    navigation.setOptions({title: channel?.data?.subChannelName||"Channel" });

    if(!channel){

        return (
        <View >
            <Text style = {styles.errorText}>Select a channel</Text>

        </View>
        );
    }
    console.log( "current channel data");
    console.log("channel parent", channel.data?.parent);
    console.log("channel cid", channel.data.cid);
    console.log("channel name", channel.data.subChannelName);
    console.log("channel type", channel.type);
    return(
        <View style = {styles.testing}>
            <Channel channel = {channel} 
            key = {channel.data.id}
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

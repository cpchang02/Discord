//react imports:
import React from 'react';

//react-native imports:
import { View, Text, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

//stream-chat imports:
import { Channel, MessageList, MessageInput} from "stream-chat-expo";

const ChannelScreen = () =>{
    //hooks to get the current route and navigation (Drawer Stack)
    const route = useRoute();
    const navigation = useNavigation();

    const channel  = route.params?.channel;
    navigation.setOptions({title: channel?.data?.subChannelName||"Channel" });
    //if no channel is null/no channel is selected
    if(!channel){
        return (
        <View >
            <Text style = {styles.errorText}>Select a channel</Text>
        </View>
        );
    }
    //if channel is not null/a channel is selected
    console.log("ChannelScreen");
    console.log( "current channel data:");
    console.log("channel parent", channel.data.parent);
    console.log("channel cid", channel.data.cid);
    console.log("channel name", channel.data.subChannelName);
    console.log("channel type", channel.type);
    //render Channel MessageList and MessageInput
    return(
        <View>
            <Channel channel = {channel} 
            key = {channel.data.id}
            forceAlignMessages= "left">
            <MessageList />
            <MessageInput />
            </Channel>
        </View>    
    );
};

const styles = StyleSheet.create({
    errorText:{
        color: "white",
        fontSize: 16,
    },
});
export default ChannelScreen;

import { View, Text, StyleSheet } from "react-native";
import React from 'react';
import { Image } from "react-native";
import { User } from "stream-chat-expo";
  
const ChannelScreen2 = ({ channel }) => {
  if (!channel) {
    return null; // Render nothing if no channel is selected
  }
  const avatarURL = channel.data?.image; // Get the avatar URL from the channel object
  console.log(channel.data.set);
  return (
  
    <View>
      <View style = {styles.avatarContainer}>
      {avatarURL && <Image source={{ uri: avatarURL }} style={styles.avatar} />}
      </View>
      <View>
        <Text style = {styles.header}> {channel.data.set.parentName}</Text>
        

      </View>
    </View>
  );
};

export default ChannelScreen2;

const styles = StyleSheet.create({
  avatarContainer: {
    flex: 0,
    marginTop:60,
    alignItems: "center",

  },
  avatar: {
    width: 70,
    height: 70,
    alignItems: "center",
    borderRadius: 50,
  },
   
  header:{
      fontSize: 30,
      fontWeight: '400',
      color: "white",
      
  },

});

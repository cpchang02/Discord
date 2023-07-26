import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, useChatContext } from 'stream-chat-expo';

const CustomChannelPreview = ({ channel }) => {
  const navigation = useNavigation();

  const channelName = channel?.data?.set?.name || 'Unnamed Channel';
  const lastMessage = channel.state.messages[0];
  const lastMessageText = lastMessage?.text || 'No messages yet';
  const avatar = channel?.data?.image;

  const handleChannelPress = () => {
    navigation.navigate('ChannelScreen', { channel });
  };

  return (
    <TouchableOpacity onPress={handleChannelPress}>
      <View style={styles.channelItem}>
        <Avatar image={avatar} size={50} />
        <View style={styles.channelDetails}>
          <Text style={styles.channelName}>{channelName}</Text>
          <Text style={styles.lastMessage}>{lastMessageText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  channelDetails: {
    marginLeft: 10,
  },
  channelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color:"white",
    marginRight: 50,
  },
  lastMessage: {
    fontSize: 14,
  },
});

export default CustomChannelPreview;

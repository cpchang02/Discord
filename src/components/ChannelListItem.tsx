import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChannelListItem = ({ channel }) => {
  const navigation = useNavigation();
  console.log(channel);
  const channelName = channel?.data?.set?.name || 'Unnamed Channel';
  const handleChannelPress = () => {
    navigation.navigate('ChannelScreen', { channel });
  };

  return (
    <TouchableOpacity onPress={handleChannelPress}>
      <View style={styles.channelItem}>
        <View style={styles.channelDetails}>
          <Text style={styles.channelName}>{channelName}</Text>
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

export default ChannelListItem;

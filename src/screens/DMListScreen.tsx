//react imports:
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

//react-native imports
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//stream-chat imports
import { ChannelList } from 'stream-chat-expo';

//AWS imports:
import { useAuthContext } from '../contexts/AuthContext';

//components:
import CustomChannelPreview from '../components/CustomChannelPreview';

//Direct Message Channels Display
const DMListScreen = () => {
  //AW userId and navigation hooks
  const { userId } = useAuthContext();
  const navigation = useNavigation();

  //filter for only DMs including the current user:
  const filters = { type: 'messaging', members: { $in: [userId] } };

  //button for new Direct Message Channel creation
  const onNewButtonPress = () => {
    navigation.navigate('UserListScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Direct Messages</Text>
        <View style={styles.buttonContainer}>
          <Pressable onPress = {onNewButtonPress} style = {styles.icon}>
            <AntDesign name="plus" size={35} color="white" />
          </Pressable>
         
        </View>
      </View>
      <View>
      <ChannelList filters={filters} Preview={CustomChannelPreview} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 230,
    flex: 1,
    marginLeft: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  header: {
    color: 'white',
    fontSize: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flex: 0,
  },
  buttonContainer: {
    flex: 0,
    marginLeft: 60,
  },
  icon:{
    marginLeft: 20,
    marginTop: 5,
  },
});

export default DMListScreen;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChannelList } from 'stream-chat-expo';
import { useAuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import CustomChannelPreview from '../components/CustomChannelPreview';
import { useNavigation } from '@react-navigation/native';

const DMListScreen = () => {
  const { userId } = useAuthContext();
  const filters = { type: 'messaging', members: { $in: [userId] } };
  const navigation = useNavigation();
  const onNewButtonPress = () => {
    navigation.navigate('UserListScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Direct Messages</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="newMessage"
            onPress={onNewButtonPress}
            thing="https://icon-library.com/images/white-plus-icon/white-plus-icon-3.jpg"
          />
        </View>
      </View>
      <ChannelList filters={filters} Preview={CustomChannelPreview} />
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
    backgroundColor: 'red',
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
});

export default DMListScreen;

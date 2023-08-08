//react imports:
import React, { useState, useEffect } from 'react';

//react-native imports:
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//stream-chat exports:
import { useChatContext } from 'stream-chat-expo';

//AWS importsL
import { useAuthContext } from '../contexts/AuthContext';

//component imports:
import UserListItem from '../components/UserListItem';

//screen to select users to direct message
const UserListScreen = () => {
  //hooks:
  const { client } = useChatContext();
  const { userId } = useAuthContext();
  const navigation = useNavigation();

  //user arrays
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  //fetch users from stream-chat
  const fetchUsers = async () => {
    const response = await client.queryUsers({});
    setUsers(response.users);
  };    

  useEffect(() => {
    fetchUsers();
  }, []);

  //with the selected user, start channel
  const startChannel = async (user) => {
    const channel = client.channel('messaging', {
      members: [userId, user.id],
    }); //stream chat checks if there is a unique channel between the users
    await channel.create();
    //set the channel name to be the user.name
    //TODO: set the channel name to display both the user names
    await channel.update({subChannelName: user.name });
    //navigate to the channel screen
    navigation.navigate('ChannelScreen', { channel });
    
  };

  // Filter users based on the search query
  const filteredUsers = users.filter((user) => {
    if (user.id !== userId && user.name) {
      return user.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search members"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => (
          <UserListItem user={item} onPress={startChannel} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f2f2f2',
    opacity: .40,
  },
});

export default UserListScreen;

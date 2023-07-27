import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-expo';
import UserListItem from '../components/UserListItem';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const UserListScreen = () => {
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const { userId } = useAuthContext();
  const navigation = useNavigation();

  const fetchUsers = async () => {
    const response = await client.queryUsers({});
    setUsers(response.users);
  };    

  useEffect(() => {
    fetchUsers();
  }, []);

  const startChannel = async (user) => {
    const channel = client.channel('messaging', {
      members: [userId, user.id],
    });
    await channel.create();
    await channel.update({subChannelName: user.name });
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
        onChangeText={setSearchQuery} // Update the searchQuery state when the text changes
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

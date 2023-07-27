import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const NewChannelScreen = () => {
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const [channelName, setChannelName] = useState(''); // State to store channel name
  const navigation = useNavigation();

  const fetchUsers = async () => {
    const response = await client.queryUsers({});
    setUsers(response.users);
  };

  const { userId } = useAuthContext(); // Get the user data from the context

  useEffect(() => {
    fetchUsers();
    // Initialize the selectedUsers state with the current user's name
     // Initialize the selectedUsers state with the current user's data
   
      //setSelectedUsers([currentUser]);
      console.log("current user", userId);
    
  },[userId]);

  useEffect(() => {
  }, [selectedUsers]);
  

   const toggleUserSelection = (user) => {
  

    // Check if the user is already selected and toggle the selection
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(user)
        ? prevSelectedUsers.filter((selectedUser) => selectedUser !== user)
        : [...prevSelectedUsers, user]
    );
  };

  const startChannelWithSelectedUsers = async () => {
   

    // Create a new channel with the selected users as members and the channel name as extraData
    const members = selectedUsers.map((user) => user.id);
    // Add the current user's id to the members array
    members.push(userId);

   

  console.log("test members", members);
  console.log("test members", members);
  const channel = client.channel('team', channelName ,{parent:"temp", subChannelName: "temp"});
   
  await channel.create();

  await channel.addMembers(members);

  await channel.update({ parent: channel.cid, subChannelName: "general"} );

  navigation.navigate('ChannelScreen', { channel });

  
    // Reset the state variables
    setSelectedUsers([]);
    setChannelName('');
    setSearchQuery('');
  };
  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.name &&
    user.id !== userId && // Exclude the current user
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Section to display selected users */}
      <View style={styles.selectedUsersContainer}>
        <Text style={styles.selectedUsersText}>Selected Users:</Text>
        <FlatList
          horizontal
          data={selectedUsers}
          renderItem={({ item }) => <Text style={styles.selectedUser}>{item.name}</Text>}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Input field for channel name */}
      <Text style = {styles.text}>Channel Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Channel Name"
        value={channelName}
        onChangeText={setChannelName}
      />

      {/* Search bar and user list */}
      <Text style = {styles.text}>Channel Members</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search members"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleUserSelection(item)}>
            <View style={styles.userItem}>
              <Text style={styles.text}>{item.name}</Text>
              {selectedUsers.includes(item) ? <Text>Selected</Text> : null}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity onPress={startChannelWithSelectedUsers} disabled={selectedUsers.length === 0}>
        <View style={styles.createButton}>
          <Text>Create Channel</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  container: {
    flex: 1,
  },
  selectedUsersContainer: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedUsersText: {
    fontSize: 16,
    marginRight: 10,
  },
  selectedUser: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 5,
    color: 'white',
  },
  searchBar: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f2f2f2',
    opacity: 0.4,
    marginBottom: 10,
  },
  input: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f2f2f2',
    opacity: 0.4,
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  createButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default NewChannelScreen;

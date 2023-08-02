//react imports:
import React, { useState, useEffect } from 'react';

//react-native imports:
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//stream-chat exports:
import { useChatContext } from 'stream-chat-expo';

//AWS imports:
import { useAuthContext } from '../contexts/AuthContext';

//new channel creation scren
const NewChannelScreen = () => {
  //stream client and AWS userId hooks
  const { client } = useChatContext();
  const { userId } = useAuthContext(); // Get the user data from the context


  const [users, setUsers] = useState([]); //empty state to store queried users
  const [searchQuery, setSearchQuery] = useState(''); //empty state for search query
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const [channelName, setChannelName] = useState(''); // State to store channel name
  const navigation = useNavigation();


  const fetchUsers = async () => {
    //query all users 
    //TODO: only query friends?
    const response = await client.queryUsers({});
    setUsers(response.users);
  };

//feth the users
  useEffect(() => {
    fetchUsers();
  },[userId]);

  const toggleUserSelection = (user) => {
  // Check if the user is already selected and toggle the selection
    setSelectedUsers((prevSelectedUsers) =>
    prevSelectedUsers.includes(user)
    ? prevSelectedUsers.filter((selectedUser) => selectedUser !== user)
    : [...prevSelectedUsers, user]
    );
  };

  //create channel button
  const startChannelWithSelectedUsers = async () => {
    //set members
    const members = selectedUsers.map((user) => user.id);
    // Add the current user's id to the members array
    members.push(userId);
    console.log("members:", members);
    //create channel of type team with channelName, parent and subChannelName general
    const channel = client.channel('team', channelName, {parent:"temp", subChannelName: "general"});
    await channel.create();
    //add the selected members
    await channel.addMembers(members);
    //update the channels parent to be its cid
    await channel.update({ parent: channel.cid, subChannelName: "general"} );
    //navigate to the channel screen for general
    navigation.navigate("ChannelScreen", {channel});    
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
     

      {/* Input field for channel name */}
      <Text style = {styles.header}>Channel Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Channel Name"
        value={channelName}
        onChangeText={setChannelName}
      />
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

      {/* Search bar and user list */}
      <Text style = {styles.header}>Search:</Text>
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
  header:{
    color: "white",
    fontSize: 20,
  },
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

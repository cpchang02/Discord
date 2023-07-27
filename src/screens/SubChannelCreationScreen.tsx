import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
const SubChannelCreationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { client} = useChatContext();
  const { user, userId } = useAuthContext(); // Get the user data from the context
  const channel = route.params?.channel;
  const parentBranch = channel.data.parent;
  console.log( "parent", parentBranch);
  console.log("current user", userId);
  console.log("channel data", channel.state.members);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const [channelName, setChannelName] = useState(''); // State to store channel name
  const memberList = Object.values(channel.state.members || {}).map((member) => member.user);

  console.log("member list", memberList);

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
    members.push(userId);
    console.log("member ids", members);
    
    // Use the user input for the channel name
    const newChannel = client.channel('subchannel', channelName, {parent: parentBranch, subChannelName: channelName});

    await newChannel.create();

    await newChannel.addMembers(members);

    navigation.navigate('ChannelScreen', { channel: newChannel });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => toggleUserSelection(item)}>
        <View style={styles.userItem}>
          <Text style={styles.text}>{item.name}</Text>
          {selectedUsers.includes(item) ? <Text>Selected</Text> : null}
        </View>
      </TouchableOpacity>
    );
  };

  const filteredUsers = memberList.filter(
    (user) =>
      user.name &&
      user.id !== userId && // Exclude the current user
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Input field for channel name */}
      <Text style={styles.text}>Channel Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Channel Name"
        value={channelName}
        onChangeText={setChannelName}
      />
        {/* Section to display selected users */}
      <ScrollView horizontal contentContainerStyle={styles.selectedUsersContainer}>
        {selectedUsers.map((user) => (
          <View key={user.id} style={styles.selectedUserItem}>
            <Text style={styles.selectedUserName}>{user.name}</Text>
          </View>
        ))}
      </ScrollView>
      {/* Search bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search members"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {/* User list */}
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity onPress={startChannelWithSelectedUsers} disabled={selectedUsers.length === 0 || channelName === ''}>
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
  input: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f2f2f2',
    opacity: 0.4,
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  searchBar: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f2f2f2',
    opacity: 0.4,
    marginBottom: 10,
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
  selectedUsersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  selectedUserItem: {
    backgroundColor: '#eaeaea',
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal:1,
    marginRight: 1,
    height: 20,
  },
  selectedUserName: {
    color: 'black',
  },
});

export default SubChannelCreationScreen;

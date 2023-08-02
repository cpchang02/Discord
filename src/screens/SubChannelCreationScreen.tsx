//react imports:
import React, { useState } from 'react';
import { EvilIcons } from "@expo/vector-icons";

//react-native imports
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

//stream-chat imports
import { useChatContext } from 'stream-chat-expo';

//AWS imports:
import { useAuthContext } from '../contexts/AuthContext';

//SubChannel Creation SCreen
const SubChannelCreationScreen = ({ route }) => { //pass in route object as parameter, a.k.a channel
  //hooks for navigation, client, and userId
  const navigation = useNavigation();
  const { client} = useChatContext();
  const {  userId } = useAuthContext(); 
  //get the current channel that we are in
  const channel = route.params?.channel;
  //find the parentBranch of the channel, a.k.a the server
  const parentBranch = channel.data.parent;
  console.log( "parent", parentBranch);


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const [channelName, setChannelName] = useState(''); // State to store channel name
  //members mapped into memberList
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
  //channel creation
  const startChannelWithSelectedUsers = async () => {
    console.log("creating sub channel");
    //members to store the user ids of all the selected users
    const members = selectedUsers.map((user) => user.id);
    //push current user onto list
    members.push(userId);
    console.log("member ids", members);
    
    // create new channel of type 'subchannel' with same parentBranch as the server and subChannelName = 'channelName'
    const channel = client.channel('subchannel', channelName, {parent: parentBranch, subChannelName: channelName});
    await channel.create();
    //add members to channel
    await channel.addMembers(members);
    //navigate to the new channel screen
    navigation.navigate("ChannelScreen", {channel});

    //reset all inputs after subchannel has been created
    setSelectedUsers([]);
    setChannelName('');
    setSearchQuery('');
};

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => toggleUserSelection(item)}>
        <View style={styles.userItem}>
          <Text style={styles.text}>{item.name}</Text>
          {selectedUsers.includes(item) ? <EvilIcons name="check" size={24} color="white" /> : null}
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

export default SubChannelCreationScreen;

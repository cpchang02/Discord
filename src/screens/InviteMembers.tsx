//react imports:
import React, { useEffect, useState } from "react";

//react-native imports:
import { Text, FlatList, Pressable, StyleSheet} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

//stream-chat imports:
import {useChatContext } from "stream-chat-expo";

//AWS imports:
import { useAuthContext } from "../contexts/AuthContext";

//component imports:
import UserListItem from "../components/UserListItem";

//Screen to invite new Members to a channel
const InviteMembers = () => {
  //steam-chat and route and navigation hooks
  const { client } = useChatContext();
  const navigation = useNavigation();
  const route = useRoute();
  const channel = route.params.channel;

  //array of users to invite
  const [users, setUsers] = useState([]);
  //array of selected users
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  //fetch users from stream-chat
  const fetchUsers = async () => {
    //query all the existing members of a channel
    const existingMembers = await channel.queryMembers({});
    const existingMemberIds = existingMembers.members.map((m) => m.user_id);
    //filter out existing users in the channel from being querried into response
    const response = await client.queryUsers({
      id: { $nin: existingMemberIds },
    });
    setUsers(response.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //function for selecting users from users
  const selectUser = (user) => {
    console.log("selected ", user.id);
    //if the user has already been selected, deselect the user from SelecteUsers array 
    if (selectedUserIds.includes(user.id)) {
      setSelectedUserIds((existingUsers) =>
        existingUsers.filter((id) => id !== user.id)
      );
    } else {
      setSelectedUserIds((exisitingUsers) => [...exisitingUsers, user.id]);
    }
  };
  //add selected users to the channel and navigate to channel screen
  const inviteUsers = async () => {
    await channel.addMembers(selectedUserIds);
    navigation.navigate("ChannelScreen", {channel});
  };
  
  //display
  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <UserListItem
          user={item}
          onPress={selectUser}
          isSelected={selectedUserIds.includes(item.id)}/>
      )}
      //invite button at list header
      ListHeaderComponent={() =>!!selectedUserIds.length && (
        <Pressable style = {styles.buttonContainer} onPress={inviteUsers} >
            <Text style = {styles.text}> Invite</Text>
        </Pressable>
      )}
    />
  );
};
const styles = StyleSheet.create ({
  text:{
      color: "white",
      fontSize: 30,
  },
  buttonContainer:{
    backgroundColor: "blue",
    alignItems: "center",
  }
});
export default InviteMembers;
import { View, Text, FlatList, Pressable, StyleSheet} from "react-native";
import React, { useEffect, useState } from "react";
import { Channel, useChatContext } from "stream-chat-expo";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserListItem from "../components/UserListItem";

const InviteMembers = () => {
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const { userId } = useAuthContext();
  const navigation = useNavigation();
  const route = useRoute();
  const channel = route.params.channel;

  const fetchUsers = async () => {
    const existingMembers = await channel.queryMembers({});
    const existingMemberIds = existingMembers.members.map((m) => m.user_id);

    const response = await client.queryUsers({
      id: { $nin: existingMemberIds },
    });
    setUsers(response.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const selectUser = (user) => {
    console.log("selection happening");
    if (selectedUserIds.includes(user.id)) {
      setSelectedUserIds((existingUsers) =>
        existingUsers.filter((id) => id !== user.id)
      );
    } else {
      setSelectedUserIds((exisitingUsers) => [...exisitingUsers, user.id]);
    }
  };

  const inviteUsers = async () => {
    await channel.addMembers(selectedUserIds);
    navigation.navigate("ChannelScreen", {channel});
  };

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <UserListItem
          user={item}
          onPress={selectUser}
          isSelected={selectedUserIds.includes(item.id)}
        />
      )}
      ListHeaderComponent={() =>
        !!selectedUserIds.length && (
          <Pressable style = {styles.buttonContainer}
          onPress={inviteUsers} >
            <Text style = {styles.text}> Invite</Text>
            </Pressable>
        )
      }
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
import { Pressable, Text, StyleSheet, Image, View } from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";

const UserListItem = ({ user, onPress, isSelected = false }) => {
  return (
    <Pressable style={styles.root} onPress={() => onPress(user)} >
      <Image source={{ uri: user.image }} style={styles.image} />
      <Text style={styles.name}>{user.name}</Text>
      <View style={{ marginLeft: "auto" }}>
        {isSelected && <EvilIcons name="check" size={24} color="white" />}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UserListItem;

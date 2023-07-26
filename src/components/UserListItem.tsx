
import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'

const UserListItem = ({user, onPress}) => {
    console.log ("Did it render?");
    console.log (user.image);
  return (
    <Pressable style = {styles.root} onPress = {() =>onPress(user)}>
        <Image source = {{uri: user.image}} style = {styles.image} />
      <Text style = {styles.name}>{user.name}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    root:{

    },
    image: {
        width: 50,
        aspectRatio: 1,
        borderRadius: 25,
    },
    name: {
        color: "white",
    },
});
export default UserListItem
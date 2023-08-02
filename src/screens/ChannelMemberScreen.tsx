import { Text, StyleSheet } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FlatList } from 'react-native-gesture-handler'
import UserListItem from '../components/UserListItem'
import { Pressable } from 'react-native'

const ChannelMemberScreen = () => {
  const [members, setMembers] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const channel = route.params.channel;
console.log("channel member screen");
  const fetchMembers = async() => {
    const response =  await channel.queryMembers({});
    setMembers(response.members);
    console.log("display members", response);
  }

  useEffect(()=> {
    fetchMembers();
  }, [channel]);
  
  return (
    <FlatList
    data = {members}
    keyExtractor = {(item) => item.user_id}
    renderItem = {({item}) => (
      
      <UserListItem user = {item.user} onPress={()=>{}} />

    )}
    ListHeaderComponent = {()=> 
    <Pressable onPress = {()=>{
      navigation.navigate("InviteMembers", { channel }); // Correct the way you pass the parameter

    }}
     style = {styles.buttonContainer}>
      <Text style = {styles.text}> Invite Members</Text>

    </Pressable>}
    />
    
  )
}
const styles = StyleSheet.create({
  text:{
    color: "white",
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer:{
    backgroundColor: "blue",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
})
export default ChannelMemberScreen
//react imports:
import { useEffect, useState, React } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

//react-native imports:
import { Text, StyleSheet, Pressable } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

//component imports:
import UserListItem from '../components/UserListItem'

//Displays the Members of a channel and allows user to invite more members
const ChannelMemberScreen = () => {
  //navigation and route hooks:
  const navigation = useNavigation();
  const route = useRoute();
  const channel = route.params.channel;
  console.log("channel member screen");

  //members array
  const [members, setMembers] = useState([]);
  //fetch members from stream-chat server
  const fetchMembers = async() => {
    const response =  await channel.queryMembers({});
    setMembers(response.members);
    console.log( channel.data.subChannelname,"members", response);
  }
  //fetch channel members
  useEffect(()=> {
    fetchMembers();
  }, [channel]);
  //display
  return (
    <FlatList
    data = {members}
    keyExtractor = {(item) => item.user_id}
    renderItem = {({item}) => (
      <UserListItem user = {item.user} onPress={()=>{}} />)}
    ListHeaderComponent = {()=> 
    <Pressable 
      onPress = {()=>{navigation.navigate("InviteMembers", { channel });}} //navigate to invite members screen and pass in the channel
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
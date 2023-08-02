//react imports:
import { useState } from 'react';

//react native imports:
import 'react-native-gesture-handler';
import {StyleSheet, Pressable, Text, View, SafeAreaView} from 'react-native';

//react-native drawer imports:
import { createDrawerNavigator} from '@react-navigation/drawer';

//stream-chat imports:
import {ChannelList } from 'stream-chat-expo';

//AWS imports:
import { useAuthContext } from '../contexts/AuthContext';
import { Auth } from 'aws-amplify';

//screens:
import ChannelScreen2 from '../screens/ChannelScreen2';
import DMListScreen from '../screens/DMListScreen';
import UserListScreen from '../screens/UserListScreen';
import newChannelScreen from '../screens/newChannelScreen';
import SubChannelCreationScreen from '../screens/SubChannelCreationScreen';
import ChannelScreen from '../screens/ChannelScreen';

//route nav:
import ChannelStack from './ChannelStack';

//uncategorized imports:
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return(
        <Drawer.Navigator 
         drawerContent = {CustomDrawerContent}>
          {/* Channel Messaging Screen */}
           <Drawer.Screen
              name="ChannelScreen"
              component={ChannelScreen}
              options={({ navigation, route }) => ({
              title: "ChannelScreen",
              //render MembersIcon in right side of header, pass in route and navigation props
              headerRight: () => (
              <MembersIcon route={route} navigation={navigation} style = {styles.icon} />
              ),
            })}
            />
            {/* Direct Message Channel List */}
            <Drawer.Screen
            name = "DMListScreen"
            component = {DMListScreen}
            options = {{title: "Users"}}/>
            
            {/* List of Users to Select for Direct Messages */}
            <Drawer.Screen
            name = "UserListScreen"
            component = {UserListScreen}
            options = {{title: "UserListScreen"}}
            
          />
          {/* SubChannel Creation Screen for Server */}
           <Drawer.Screen
            name = "SubChannelCreationScreen"
            component = {SubChannelCreationScreen}
            options = {{title: "SubChannelCreationScreen"}}
          />
          {/* ServerCreationScreen */}
          <Drawer.Screen
            name = "newChannelScreen"
            component = {newChannelScreen}
            options = {{title: "newChannelScreen"}}/>
          {/* Member List Screen for Channel */}
           <Drawer.Screen
              name="ChannelMembers"
              component={ChannelStack}
              options={{
                headerShown: false,
              }}
            />
        </Drawer.Navigator>
    );
};

//MemberIcon component, pass in props route and navigation
const MembersIcon = ({route, navigation})=>{
  //if no channel is selected, do not display or execute anything
  if (!route?.params?.channel){
      return null; 
  } 
  return (
    // if channel is selected
    route?.params?.channel && (
      //Pressable that brings you to the ChannelMembers Screen for the Channel
      <Pressable 
        style = {styles.icon} 
        onPress ={()=> 
          //navigate to the ChannelMembers with "Chat" route name and 'channe' object passed as parameter
          navigation.navigate("ChannelMembers", {screen: 'Chat', params:{ channel: route.params.channel}})}>
          <FontAwesome name="users" size={24} color="white" />
      </Pressable>
    )
  )
};
//Custom Drawer
const CustomDrawerContent = (props) => {
  //screen in the sidebar
  const [selectedScreen, setSelectedScreen] = useState("DMListScreen"); // Default to ChannelScreen2
  //channel selected from the drawer ChannelList
  const [selectedChannel, setSelectedChannel] = useState(null);

  const {navigation} = props;

  const onChannelSelect = (channel) => {
    console.log("channel select performed");
    setSelectedChannel(channel); //set selected channel
    setSelectedScreen("ChannelScreen2"); // Set to ChannelScreen2 when channel is selected  
    navigation.navigate("ChannelScreen", {channel}); //navigate to selected channel's ChannelScreen

  };
  const onDMButtonPress = () => {
    console.log("Direct Message List Button Pressed");
    //Sidebar now displays DMListScreen
    setSelectedScreen("DMListScreen");
      
  };
  //create new server button
  const onNewButtonPress = () => {
    console.log("newServer Button Pressed");
    //TODO: want to set this to the newly created channel
    setSelectedChannel(null);
    //navigatie to the new server creation screen
    navigation.navigate("newChannelScreen");
  };
  //logout component
  //TODO: Change the location of this
  const {userId} = useAuthContext();
  const whatnot = {type : 'team', members: {$in: [userId]} };
  const logout = () =>{
    console.log("Logout Button Pressed");
    Auth.signOut();
  };
  
  
  //Drawer Display
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text onPress = {logout} style = {styles.test}>Logout</Text>
      </View>
      <View style={styles.sideBarContainer}>
        <View style = {styles.buttonContainer}>
          <Pressable onPress= {onDMButtonPress} >
            <Entypo name="chat" size={40} color="white" />
          </Pressable>
        </View>
      <View style = {styles.channelListContainer}>
        <ChannelList onSelect={onChannelSelect} filters={whatnot}/>
          <View style = {styles.buttonContainer2}>
            <Pressable onPress = {onNewButtonPress}>
              <AntDesign name="plus" size={35} color="white" />
            </Pressable>
          </View>
      </View>
      </View>
      {/* if the selectedScreen is "DMListScreen" */}
      {selectedScreen === "DMListScreen" ? (
        <View style={styles.separateScreenContainer}>
          <DMListScreen />
        </View>
      ) : (
      // otherwise render the ChannelScreen2 component only if selectedChannel is not null
      <View style={styles.separateScreenContainer}>
      {selectedChannel && <ChannelScreen2 channel={selectedChannel} />}
      </View>
      )}
    </SafeAreaView>
  );
     
};



const styles = StyleSheet.create({

  buttonContainer2:{
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5, // Optional: Add some padding to the bottom if needed
  },
  test:{
    fontSize: 30,
    color: "white",
    alignContent: "center",
    flex: 0,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sideBarContainer: {
    flex: 1,
    marginTop: 40,
    marginLeft:-95,
    justifyContent: "center",
    alignContent: "center",  
  },
  channelListContainer:{
    flex:1,
    marginTop: 0,
    alignContent:"center",
    justifyContent: "center",
    marginRight: -10,
  },
  separateScreenContainer: {
    width: 100,
    flex: 5,
    marginTop:40,
    alignItems: "center",
    justifyContent:'flex-start',
    marginLeft: 10,
  },
  buttonContainer:{
    marginLeft: 5,
  },
  icon:{
    marginRight: 10,
  }
});

export default DrawerNavigator;
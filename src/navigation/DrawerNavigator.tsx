import 'react-native-gesture-handler';
import { createDrawerNavigator} from '@react-navigation/drawer';
import ChannelScreen from '../screens/ChannelScreen';
import {StyleSheet } from 'react-native';
const Drawer = createDrawerNavigator();
import {ChannelList } from 'stream-chat-expo';
import { useAuthContext } from '../contexts/AuthContext';
import { Text } from 'react-native';
import { View } from 'react-native';
import ChannelScreen2 from '../screens/ChannelScreen2';
import { useState } from 'react';
import {SafeAreaView } from 'react-native-safe-area-context';
import { Auth } from 'aws-amplify';
import Button from '../components/Button';
import DMListScreen from '../screens/DMListScreen';
import UserListScreen from '../screens/UserListScreen';
import newChannelScreen from '../screens/newChannelScreen';
const DrawerNavigator = () => {
    return(
        <Drawer.Navigator 
         drawerContent = {CustomDrawerContent}>
            <Drawer.Screen 
              name = "ChannelScreen" 
              component = {ChannelScreen} 
              options={{title: "Channel"}}
            />
            <Drawer.Screen
            name = "DMListScreen"
            component = {DMListScreen}
            options = {{title: "Users"}}/>
            
            <Drawer.Screen
            name = "UserListScreen"
            component = {UserListScreen}
            options = {{title: UserListScreen}}
            
          />

<Drawer.Screen
            name = "newChannelScreen"
            component = {newChannelScreen}
            options = {{title: newChannelScreen}}/>



        </Drawer.Navigator>
    );
};
const CustomDrawerContent = (props) => {
  const [selectedScreen, setSelectedScreen] = useState("ChannelScreen2"); // Default to ChannelScreen2

  const [selectedChannel, setSelectedChannel] = useState(null);
  const {navigation} = props;
    const onChannelSelect = (channel) => {
        //navigate to screen for selected channel
        setSelectedChannel(channel);
        setSelectedScreen("ChannelScreen2"); // Set to ChannelScreen2 when channel is selected

        navigation.navigate("ChannelScreen", {channel});

    };
    const onDMButtonPress = () => {
      // Navigate to the desired screen when the "dm" button is pressed
      setSelectedScreen("DMListScreen"); // Set to UserList when "dm" button is pressed
      
    };
    const onNewButtonPress = () => {
      navigation.navigate("newChannelScreen");
      
    };
   

    const {userId} = useAuthContext();
    
    const whatnot = {type : 'team', members: {$in: [userId]} };
    const logout = () =>{
      Auth.signOut();
    };
    
    return (
        <SafeAreaView style={styles.container}>
          <Text onPress = {logout} style = {styles.test}>Logout</Text>

          <View style={styles.sideBarContainer}>
            <View>
              <Button 
              title = "dm" 
              onPress = {onDMButtonPress} 
              thing = "https://png.pngitem.com/pimgs/s/69-699673_transparent-water-play-sprinkler-clipart-people-user-group.png"/>
            </View>
            <View style = {styles.channelListContainer}>
            <ChannelList onSelect={onChannelSelect} filters={whatnot}/>
            <View style = {styles.buttonContainer2}>
            <Button
            title = "newChannel"
            onPress = {onNewButtonPress}
            thing = "https://icon-library.com/images/white-plus-icon/white-plus-icon-3.jpg"/>
            </View>
            </View>
         </View>
      {selectedScreen === "DMListScreen" ? (
        <View style={styles.separateScreenContainer}>
          <DMListScreen />
        </View>
      ) : (
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
    bottom: 0,
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
      backgroundColor: "blue"
   
    },
    channelListContainer:{
      flex:1,
      marginTop: 0,
      alignContent:"center",
      justifyContent: "center",
    },
    separateScreenContainer: {
      width: 100,
      flex: 5,
      marginTop:40,
      alignItems: "center",
      justifyContent:'flex-start',
    },
  });

export default DrawerNavigator;
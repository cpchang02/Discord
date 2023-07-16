import 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerItem, DrawerScreenProps, DrawerView} from '@react-navigation/drawer';
import ChannelScreen from '../screens/ChannelScreen';
import {StyleSheet } from 'react-native';
const Drawer = createDrawerNavigator();
import { Avatar, ChannelList } from 'stream-chat-expo';
import { useAuthContext } from '../contexts/AuthContext';
import { Text } from 'react-native';
import { View } from 'react-native';
import ChannelScreen2 from '../screens/ChannelScreen2';
import { useState } from 'react';
const DrawerNavigator = () => {
    return(
        <Drawer.Navigator drawerContent = {CustomDrawerContent}>
            <Drawer.Screen name = "ChannelScreen" component = {ChannelScreen} options={{title: "Channel"}}/>
        </Drawer.Navigator>
    );
};
const CustomDrawerContent = (props) => {
  const [selectedChannel, setSelectedChannel] = useState(null);

    const onChannelSelect = (channel) => {
      console.log("Selected Channel:", channel);
        //navigate to screen for selected channel
        setSelectedChannel(channel);
        props.navigation.navigate("ChannelScreen", {channel});

    };
   

    const {userId} = useAuthContext();
    
    const filters = {members: {$in: [userId]}};
 
    
    return (
        <View style={styles.container}>
        <View style={styles.sideBarContainer}>
          <View style = {styles.channelListContainer}>
          <ChannelList onSelect={onChannelSelect} filters={filters} />

          </View>
        </View>
        {selectedChannel && (
        <View style={styles.separateScreenContainer}>
          <ChannelScreen2 channel={selectedChannel} />
        </View>
      )}
      </View>
    );
    
  
};



const styles = StyleSheet.create({
  test:{
    fontSize: 30,
    color: "white",
  },
  
    container: {
      flex:1,
      flexDirection: 'row',

    },
    sideBarContainer: {
      flex:1,
      marginTop: 0,
      
    },
    channelListContainer:{
      flex:1,
      marginTop: 60,
    },
    separateScreenContainer: {
      flex: 4,
      alignItems: "center",
      justifyContent:'flex-start',
      backgroundColor: "#2B2D31",
    },
  });

export default DrawerNavigator;
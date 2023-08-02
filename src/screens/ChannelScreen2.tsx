//react imports:
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

//react-native imports:
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Image, Pressable } from "react-native";
import { useNavigation} from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";

//stream-chat imports:
import { Avatar, ChannelAvatar, useChatContext } from "stream-chat-expo";

//AWS imports:
import { useAuthContext } from "../contexts/AuthContext";

//components:
import Button from "../components/Button";

//pass in object channel prop
const ChannelScreen2 = ({ channel }) => {
  //navigation, client, and userId hook
  const navigation = useNavigation();
  const { client } = useChatContext();
  const { userId } = useAuthContext();

  //channel avatar image
  const avatarURL = channel.data?.image; 
  //channel parent id
  const parentBranch = channel.data.parent;
  //subchannel list of a server
  const [channels, setChannels] = useState([]);
  //when channels are being loaded/fetched
  const [loading, setLoading] = useState(true);
  //refresh subchannel list
  const [refreshing, setRefreshing] = useState(false); 
  
  //fetch channels of server
  const fetchChannels = async () => {
    try {
      setLoading(true);
      //filter channels to display on channels that include the user and have the parent == Server parent
      const filters = { members: { $in: [userId] }, 'parent': { $eq: parentBranch} };
      //sort with oldest channels at the top
      const sort = { created_at: 1 }; 
      //query channels
      const response = await client.queryChannels(filters, sort, {
        watch: false, // Enable real-time updates for the channel list TODO: this doesnt work?
      });
      setChannels(response);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.log("Error fetching channels:", error);
    }
  };
  // fetch the channels once when the component is mounted
  useEffect(() => {
    fetchChannels();
  }, [client, userId, channel]);
  //client, userId, and channel as dependencies to ensure that the channels are re-fetched whenever any of these dependencies change.
  //TODO: does not update when channel changes, needs to be refreshed
  //new subchannel
  const onNewButtonPress = () => {
    console.log("subchannel creation button has been pressed");
    navigation.navigate('SubChannelCreationScreen', { channel });
  }; 
  //select subchannel
  const onChannelSelect = (channel) => {
    //TODO: make the selected channel highlighted in teh query bar
    console.log("subchannel has been pressed");
    navigation.navigate("ChannelScreen", {channel});
  };   

  // Function to handle the refresh event when the user drags down the screen
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChannels();
    setRefreshing(false);
  };
  //Display
  return (
    //wrap ChannelScreen2 in ScrollView
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View>
        {/* server name and header */}
        <View>
          <Text style={styles.header}> {channel.data.id}</Text>
          <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeader}>Channels:</Text>
            {/* new channel button for server */}
            <Pressable onPress={onNewButtonPress}>
            <AntDesign name="plus" size={25} color="white" />
            </Pressable>
          </View>
          {/* Render the list of channels */}
          {loading ? (
            <Text style={styles.text}>Loading...</Text>
          ) : (
            <FlatList
              data={channels}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onChannelSelect(item)}>
                  <View style={styles.channelItem}>
                    <Text style={styles.text}># {item.data.subChannelName}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.cid}
              ListEmptyComponent={<Text style={styles.text}>No channels found</Text>}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 15,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    width: 200,
  },
  contentContainer: {
    flexGrow: 1,
  },
  avatarContainer: {
    flex: 0,
    marginTop: 60,
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    alignItems: "center",
    borderRadius: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: '400',
    color: "white",
    marginLeft: 9,
    fontWeight: "900",
  },
  subHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    paddingTop: 10,
  },
  subHeader: {
    color: "white",
    baddingBottom: 10,
    paddingLeft:10,
    fontSize: 18,
    fontWeight: "bold",
  },
  channelItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  
  
  },
});

export default ChannelScreen2;

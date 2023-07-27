import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from 'react';
import { Image } from "react-native";
import { useChatContext } from "stream-chat-expo";
import { useAuthContext } from "../contexts/AuthContext";
import Button from "../components/Button";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";

const ChannelScreen2 = ({ channel }) => {
  const navigation = useNavigation();
  const { client } = useChatContext();
  const { userId } = useAuthContext();
  const avatarURL = channel.data?.image; // Get the avatar URL from the channel object
  const parentBranch = channel.data.parent;
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State to control the refreshing state of the ScrollView

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const filters = { members: { $in: [userId] }, 'parent': { $eq: parentBranch} };
      const sort = { created_at: 1 }; // Use -1 for descending order
      const response = await client.queryChannels(filters, sort, {
        watch: true, // Enable real-time updates for the channel list
      });
      setChannels(response);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.log("Error fetching channels:", error);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [client, userId]);

  // Function to handle the screen focus event and reload the channels
  useFocusEffect(
    React.useCallback(() => {
      fetchChannels();
    }, [])
  );

  const onNewButtonPress = () => {
    navigation.navigate('SubChannelCreationScreen', { channel });
  }; 

  const onChannelSelect = (channel) => {
    navigation.navigate("ChannelScreen", { channel });
  };   

  // Filter the channels based on the custom data field "data.set.parent"
  //const parentBranch = channel.data.set.parent;
  //const filteredChannels = channels.filter((channel) => channel.data.set.parent === parentBranch);

  // Function to handle the refresh event when the user drags down the screen
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChannels();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View>
        <View style={styles.avatarContainer}>
          {avatarURL && <Image source={{ uri: avatarURL }} style={styles.avatar} />}
        </View>
        <View>
          <Text style={styles.header}> {channel.data.id}</Text>
          <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeader}>Channels</Text>
            <Button
              title="newSubChannel"
              onPress={onNewButtonPress}
              thing="https://icon-library.com/images/white-plus-icon/white-plus-icon-3.jpg"
            />
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
                    <Text style={styles.text}>{item.data.subChannelName}</Text>
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
  },
  container: {
    flex: 1,
    backgroundColor: "blue",
    width: 200
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
    fontSize: 30,
    fontWeight: '400',
    color: "white",
  },
  subHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  subHeader: {
    color: "white",
  },
  channelItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default ChannelScreen2;

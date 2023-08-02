import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

import ChannelMemberScreen from "../screens/ChannelMemberScreen";
import InviteMembers from "../screens/InviteMembers";
const ChannelStack = ()=>{
    return(
    <Stack.Navigator>

    <Stack.Screen
            name = "Chat"
            component = {ChannelMemberScreen}
            options = {{title: "Channel Members"}}
    />
    <Stack.Screen
            name = "InviteMembers"
            component = {InviteMembers}
            options = {{title: "Invite Members"}}
    />
    </Stack.Navigator>
    );
    
};
export default ChannelStack;
       
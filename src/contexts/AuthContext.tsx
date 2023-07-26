import { createContext, useState, useContext, useEffect } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { getStreamToken } from "../graphql/queries";
import { Alert } from "react-native";
const AuthContext = createContext({
    userId: null,
    setUserId: (nexId:string)=> {}
});

const AuthContextComponent = ({children, client})=>{
    const [userId, setUserId] = useState(null);
    
    const connectStreamChatUser = async() =>{
        const userData = await Auth.currentAuthenticatedUser();
        const {sub, email}= userData.attributes;
         const tokenResponse = await API.graphql(graphqlOperation(getStreamToken));
         const token = tokenResponse.data.getStreamToken;
         if(!token){
            Alert.alert("Failed to fetch the token")
            return;
         }
        await client.connectUser(
            {
            id: sub,
            name: email,
            image: "data:image/jpeg;base64,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",
            }, 
            token 
        );
        setUserId(sub);

     };
    useEffect(() => {
        connectStreamChatUser();
    }, [])
    
    return(<AuthContext.Provider value = {{userId, setUserId}}>
        {children}
    </AuthContext.Provider>)
};

export default AuthContextComponent;
//automatically return AuthContext
export const useAuthContext = () => useContext(AuthContext);
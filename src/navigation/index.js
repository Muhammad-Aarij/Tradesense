// import {NavigationContainer} from '@react-navigation/native';
// import React, {useState, useEffect} from 'react';
// import AuthNavigator from './AuthNavigator';
// import HomeNavigtor from './HomeNavigator';
// import {View, ActivityIndicator} from 'react-native';
// import {AuthContext} from '../components/context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import BottomTabs from './BottomTabs';

// const AppNavContainer = () => {
//   initialLoginState = {
//     isLoading: true,
//     userName: null,
//     userToken: null,
//   }; 

//   const loginReducer = (prevState, action) => {
//     switch (action.type) {
//       case 'RETRIEVE_TOKEN':
//         return {
//           ...prevState,
//           userToken: action.token,
//           isLoading: false,
//         };
//       case 'LOGIN':
//         return {
//           ...prevState,
//           userName: action.id,
//           userToken: action.token,
//           isLoading: false,
//         };
//       case 'LOGOUT':
//         return {
//           ...prevState,
//           userName: null,
//           userToken: null,
//           isLoading: false,
//         };
//       case 'REGISTER':
//         return {
//           ...prevState,
//           userName: action.id,
//           userToken: action.token,
//           isLoading: false,
//         };
//     }
//   };

//   const [loginState, dispatch] = React.useReducer(
//     loginReducer,
//     initialLoginState,
//   );

//   const authContext = React.useMemo(
//     () => ({
//       signIn: async (email, tokenId) => {
//         try {
//           console.log('signIn tokenId ***************************************************', tokenId);
//           await AsyncStorage.setItem('token', tokenId);
//         } catch (e) {
//           console.log(e);
//         }
//         dispatch({type: 'LOGIN', id: email, token: tokenId});
//       },
//       signInG: async (email, tokenId) => {
//         try {
//           await AsyncStorage.setItem('token', tokenId);
//         } catch (e) {
//           console.log(e);
//         }
//         dispatch({type: 'LOGIN', id: email, token: tokenId});
//       },
//       signUp: async (email, tokenId) => {
//         try {
//           console.log('signUp tokenId ***************************************************', tokenId);
//           await AsyncStorage.setItem('token', tokenId);
//         } catch (e) {
//           console.log(e);
//         }
//         dispatch({type: 'LOGIN', id: email, token: tokenId});
//       },
//       signOut: async () => {
//         try {
//           await AsyncStorage.removeItem('token');
//           await AsyncStorage.removeItem('user');
//           console.log('token removed');
//         } catch (e) {
//           console.log(e);
//         }
//         dispatch({type: 'LOGOUT'});
//       },
//     }),
//     [],
//   );

//   useEffect(() => {
//     setTimeout(async () => {
//       let token;
//       token = null;
//       try {
//         token = await AsyncStorage.getItem('token');
//       } catch (e) {
//         console.log(e);
//       }
//       dispatch({type: 'RETRIEVE_TOKEN', token: token});
//     }, 1000);
//   }, []);

//   if (loginState.isLoading) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }
//   return (
//     <AuthContext.Provider value={authContext}>
//       <NavigationContainer>
//         {loginState.userToken != null ? <BottomTabs /> : <AuthNavigator />}
//       </NavigationContainer>
//     </AuthContext.Provider>
//   );
// };

// export default AppNavContainer;


 // "@react-navigation/bottom-tabs": "^7.3.10",
    // "@react-navigation/native": "^7.1.6",
    // "@react-navigation/native-stack": "^7.3.10",
    // "react-native-safe-area-context": "^5.3.0",
    // "react-native-screens": "^4.10.0"
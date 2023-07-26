import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {MenuProvider} from 'react-native-popup-menu';

import Login from './Login';
import Register from './Register';
import Home from './Authenticated';
import Profile from './Profile';
import Fridge from './Fridge';
import Scan from './Scan';

import * as Keychain from 'react-native-keychain';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  Fridge: undefined;
  Scan: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(() => {
    // Initial state is unknown until we've checked for a valid token
    // We represent this with null
    let initialAuthState = null;
    (async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        // Set initialAuthState based on whether credentials exist
        initialAuthState = !!credentials;
        setIsUserAuthenticated(initialAuthState);
      } catch (error) {
        console.log(error);
      }
    })();
    return initialAuthState;
  });

  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isUserAuthenticated ? 'Home' : 'Login'}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Fridge" component={Fridge} />
          <Stack.Screen name="Scan" component={Scan} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}

export default App;

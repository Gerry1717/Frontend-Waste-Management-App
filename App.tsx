import React, {useEffect, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {MenuProvider} from 'react-native-popup-menu';

import Login from './Login';
import Register from './Register';
import Home from './Home';
import Profile from './Profile';
import Fridge from './Fridge';
import Scan from './Scan';
import Catalogue from './Catalogue'; // import Catalogue component

import * as Keychain from 'react-native-keychain';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  Fridge: undefined;
  Scan: undefined;
  Catalogue: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// The component that will redirect the user if they're authenticated
const RedirectToHome: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  }, []);

  return null;
};

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        setIsUserAuthenticated(!!credentials);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    // Add a loading screen or component here
    return null; // Or replace with a loading spinner
  }

  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isUserAuthenticated ? 'Login' : 'Login'}>
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen
            name="Login"
            children={props =>
              isUserAuthenticated ? <RedirectToHome /> : <Login {...props} />
            }
          />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Fridge" component={Fridge} />
          <Stack.Screen name="Scan" component={Scan} />
          <Stack.Screen name="Catalogue" component={Catalogue} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}

export default App;

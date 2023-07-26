import React, {useState, useEffect} from 'react';
import {Alert, Button, TextInput, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';
import axios from 'axios'; // Import axios
import * as Keychain from 'react-native-keychain';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login: React.FC<Props> = ({navigation}) => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getCredentials = async () => {
    try {
      // Retrieve the access token
      const accessToken = await Keychain.getGenericPassword({
        service: 'accessToken',
      });
      if (accessToken) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Authenticated'}],
        });
      } else {
        Alert.alert('No user Logged in!');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  const isDev = true; // Change this to false in production

  // Create an Axios instance with custom options
  const axiosInstance = axios.create({
    baseURL: isDev
      ? 'https://192.168.1.7/api/'
      : 'https://192.168.1.7/api/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleSubmit = async () => {
    if (username.length === 0 || password.length === 0) {
      Alert.alert('Username or Password Cannot be Blank');
      return;
    }

    try {
      const response = await axiosInstance.post(
        'Login', // Adjust the endpoint to match your API
        {
          username: username,
          password: password,
        },
      );

      console.log(response);
      const data = response.data;
      console.log(data);

      if (data.message === 'Login successful') {
        await Keychain.setGenericPassword(
          'credentials',
          JSON.stringify({
            username: data.username,
            accessToken: data.token,
          }),
        );
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      } else if (data.error === 'Invalid username') {
        Alert.alert('User Not Registered');
      } else {
        Alert.alert('Incorrect Username or Password!');
      }
    } catch (error) {
      Alert.alert('Error!');
      console.log('Error fetching credentials:', error);
    }
  };

  useEffect(() => {
    getCredentials();
  }, []);

  return (
    <View>
      <TextInput placeholder="Email" value={username} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Submit" onPress={handleSubmit} />
      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

export default Login;

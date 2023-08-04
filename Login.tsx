import React, {useState, useEffect} from 'react';
import {
  Alert,
  Button,
  TextInput,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';
import * as Keychain from 'react-native-keychain';
import styles from './GlobalStyles';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login: React.FC<Props> = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchData = async () => {
    try {
      // Use 'user' as the service name here
      const credentials = await Keychain.getGenericPassword({
        service: 'user',
      });
      if (credentials && credentials.password) {
        // Fetch user data from the API using fetch
        fetch(
          'http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/user-details',
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + credentials.password,
              'Content-Type': 'application/json',
            },
          },
        )
          .then(response => response.json())
          .then(data => {
            if (data.username) {
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            }
          })
          .catch(error => {
            console.error('Error fetching user details:', error);
          });
      }
    } catch (error) {
      console.log('Error fetching credentials from Keychain:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const postLogin = async () => {
    const response = await fetch(
      'http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/login',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      },
    );
    const json = await response.json();
    return json;
  };

  const handleSubmit = async () => {
    try {
      if (username.length === 0 || password.length === 0) {
        Alert.alert('Username or Password Cannot be Blank');
        return;
      }
      const responseJson = await postLogin();
      if (!responseJson.message) {
        return Alert.alert(responseJson.error);
      }

      if (responseJson.message.includes('Login successful')) {
        await Keychain.setGenericPassword(username, responseJson.token, {
          service: 'user',
        });

        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      } else if (responseJson.message.includes('Invalid username')) {
        Alert.alert('User Not Registered');
      } else {
        Alert.alert('Incorrect Username or Password!');
      }
    } catch (error) {
      Alert.alert(`Error: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {<Text style={styles.titleText}>Gerry's Waste Management App</Text>}
      </View>

      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('./icons/wm-icon.png')} // replace 'logo_url_here' with your logo's URL or require statement
        />
      </View>
      <View style={styles.form}>
        <TextInput
          textContentType="username"
          style={styles.input}
          placeholder="Email / username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.form} />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';
import * as Keychain from 'react-native-keychain';
import styles from './GlobalStyles';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const Home: React.FC<Props> = ({navigation}) => {
  const handleLogout = async () => {
    try {
      // Fetch the stored JWT
      const jwt = await Keychain.getGenericPassword({
        service: 'user',
      });
      // Send a POST request to your logout API
      const response = await fetch(
        'http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/logout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt.password}`,
          }, // Assuming jwt.password contains the actual JWT
        },
      );
      if (!response.ok) {
        Alert.alert(`HTTP error! status: ${response.status}`);
      }

      // Clear the stored credentials
      await Keychain.resetGenericPassword({
        service: 'user',
      });
      Alert.alert('Log Out: Success');
      // Reset navigation
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('A problem occurred when trying to log out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => navigation.navigate('Login')}>
        <Text>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => navigation.navigate('Catalogue')}>
        <Text>GO TO CATALOGUE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleLogout}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Fridge')}>
          <Text>Fridge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Scan')}>
          <Text>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}>
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

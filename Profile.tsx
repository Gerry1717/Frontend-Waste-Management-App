import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg'; // Import SvgXml
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';

import * as Keychain from 'react-native-keychain';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const svgXml = `
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
    <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
  </svg>
`;

const Profile: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState('John Doe');
  const [username, setUsername] = useState('No User');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const credentials = await Keychain.getGenericPassword({
          service: 'credentials',
        });

        if (credentials && credentials.password) {
          console.log('Credentials: ', credentials);
          console.log('username: ', credentials.password);
          console.log('username: ', JSON.parse(credentials.password));
          const {username} = JSON.parse(credentials.password);
          setUsername(username);
          // If needed, you can set the accessToken as well
          // setAccessToken(accessToken);
        }
      } catch (error) {
        console.log('Error fetching credentials from Keychain:', error);
      }

      // You can replace this with actual user fetching logic to set the name
      // For example, fetch user data from an API and set the name accordingly
      // setName('John Doe');
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Use SvgXml to render the SVG */}
      <SvgXml xml={svgXml} width="100" height="100" />
      <Text style={styles.text}>Name: {name}</Text>
      <Text style={styles.text}>Username/Email: {username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default Profile;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';
import styles from './GlobalStyles';

import * as Keychain from 'react-native-keychain';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Profile: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState('John Doe');
  const [username, setUsername] = useState('No User');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [IsUserVerified, setIsUserVerified] = useState(false);
  const [inputValue, setInputValue] = useState('******');
  const [isFirstFocus, setIsFirstFocus] = useState(true);

  const handleInputFocus = () => {
    if (isFirstFocus) {
      setInputValue('');
      setIsFirstFocus(false);
    }
  };

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
            setName(data.name);
            setUsername(data.username);
            setIsUserVerified(data.isVerified);
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

  const deleteUserCredentials = () => {
    // Confirm with the user
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to permanently delete all your data? (Process is Irreversable)',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return;
          }, // If they cancel, do nothing
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            // Mark as async
            try {
              const credentials = await Keychain.getGenericPassword({
                service: 'user',
              });

              // If they confirm, proceed with the deletion
              const response = await fetch(
                'http://192.168.1.7:8080/api/delete-user',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + credentials.password,
                  },
                  body: JSON.stringify({username: credentials.username}), // Assuming that the username is part of the stored credentials
                },
              );

              const data = await response.json(); // retrieve message from server after requesting completion
              // Clear the user and token from state
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            } catch (error) {
              console.error('Error:', error);
            }
          },
        },
      ],
    );
  };

  const runVerifyCheck = async () => {
    // Mark as async
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'user',
      });

      // If they confirm, proceed with the deletion
      const response = await fetch(
        'http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/user-verification-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + credentials.password,
          },
          body: JSON.stringify({verificationcode: inputValue}), // Assuming that the username is part of the stored credentials
        },
      );

      const data = await response.json(); // retrieve message from server after requesting completion
      if (!data.status || !data.code) {
        return Alert.alert('Status: ' + data.status);
      }
      setIsUserVerified(true);
    } catch (error) {
      Alert.alert('Error: ' + error);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !currentPassword) {
      return Alert.alert('Incomplete Data Entry');
    }
    if (newPassword !== repeatPassword) {
      Alert.alert("New passwords don't match!");
      return;
    }
    try {
      const credentials = await Keychain.getGenericPassword({service: 'user'});
      if (credentials && credentials.password) {
        const response = await fetch(
          'http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/change-password',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${credentials.password}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              oldPassword: currentPassword,
              newPassword,
            }),
          },
        );

        const data = await response.json();

        // You'll need to change this based on how your API indicates success
        if (response.ok) {
          Alert.alert('Password change successful!');
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        } else {
          Alert.alert(
            'Failed to change password',
            data.message || 'Something went wrong',
          );
        }
      } else {
        Alert.alert('No stored credentials', 'Please login again');
      }
    } catch (error) {
      console.error('Error during password change:', error);
      Alert.alert('Failed to change password', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{textAlign: 'center', fontSize: 30}}>
          Hello, {name ? name.split(' ')[0] : ''}
        </Text>
        <View
          style={{
            marginLeft: '7%',
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            marginTop: 5,
            marginBottom: 10,
            maxWidth: '86%',
          }}
        />
        <Text style={{paddingLeft: '9%'}}>Username/Email: {username}</Text>
        <Text style={{paddingLeft: '9%'}}>
          Is User Verified: {IsUserVerified ? 'Yes' : 'No'}
        </Text>

        {!IsUserVerified ? (
          <View style={{marginLeft: '10%', marginTop: 10, maxWidth: '80%'}}>
            <TextInput
              keyboardType="numeric"
              value={inputValue}
              onFocus={handleInputFocus}
              style={styles.verifyUserPasscodeInput}
              placeholder="******"
              maxLength={8}
              onChangeText={text => setInputValue(text)}
            />
            <Button
              title="Verify User"
              onPress={() => {
                runVerifyCheck();
              }}
            />
          </View>
        ) : null}
      </View>
      <View
        style={{
          marginLeft: '7%',
          borderBottomColor: 'black',
          borderBottomWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          maxWidth: '86%',
        }}
      />

      <Text style={styles.profileText}>Current Password:</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <Text style={styles.profileText}>New Password:</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Text style={styles.profileText}>Repeat New Password:</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />
      <TouchableOpacity
        style={styles.submitButton} // replace with your own style
        onPress={handlePasswordChange}>
        <Text style={styles.submitButtonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton} // replace with your own style
        onPress={deleteUserCredentials}>
        <Text style={styles.submitButtonText}>DELETE ACCOUNT!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

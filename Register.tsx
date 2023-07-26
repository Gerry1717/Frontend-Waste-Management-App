// screens/Register.tsx

import React, {useState} from 'react';
import {Alert, Button, TextInput, View, Text} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';
import validator from 'validator';
import axios from 'axios'; // Import axios

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const Register: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordError, setPasswordError] = useState(''); // New state for password error

  function validatePassword(passwordToTest) {
    var re = {
      lowercase: /[a-z]/g,
      uppercase: /[A-Z]/g,
      numeric: /[0-9]/g,
      special: /[\W_]/g,
    };

    if (passwordToTest.length < 8) {
      return 'Password must be at least 8 characters long.';
    }

    if (!re.lowercase.test(passwordToTest)) {
      return 'Password must contain at least one lowercase letter.';
    }

    if (!re.uppercase.test(passwordToTest)) {
      return 'Password must contain at least one uppercase letter.';
    }

    if (!re.numeric.test(passwordToTest)) {
      return 'Password must contain at least one number.';
    }

    if (!re.special.test(passwordToTest)) {
      return 'Password must contain at least one special character.';
    }

    return '';
  }

  const handlePasswordChange = (password: string) => {
    const errorMessage = validatePassword(password);
    setPasswordError(errorMessage);
    setPassword(password);
  };

  const handleSubmit = async () => {
    // Password validation
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match!');
      return;
    }

    let missingFields = [];
    if (name.length === 0) {
      missingFields.push('name');
    }
    if (email.length === 0) {
      missingFields.push('email');
    }
    if (password.length === 0) {
      missingFields.push('password');
    }
    if (confirmPassword.length === 0) {
      missingFields.push('confirm password');
    }

    if (missingFields.length > 0) {
      let missingFieldsStr = missingFields.join(', ');
      Alert.alert(`Please fill the following fields: ${missingFieldsStr}`);
      return;
    }

    if (!validator.isEmail(email)) {
      Alert.alert('Please enter a valid email');
      return;
    }

    if (passwordError) {
      Alert.alert('Password does not meet the requirements.');
      return;
    }
    // Submit to your API using axios
    try {
      const response = await axios.post(
        'https://192.168.1.7/Register',
        {name, username: email, password},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          httpsAgent: {
            // Ignore SSL certificate errors for local development
            rejectUnauthorized: false,
          },
        },
      );

      const data = response.data;
      if (data.message === 'User already exists') {
        Alert.alert('User already Registered');
      } else if (data.message === 'User registered successfully') {
        navigation.navigate('Login');
      } else {
        Alert.alert('Something Went Wrong Please Try Again');
      }
    } catch (error) {
      console.log('Error performing network request:', error.message);
      // Handle error here, e.g., show error message to the user
      Alert.alert('Error occurred. Please try again later.');
    }
  };

  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange} // use the new handler
        secureTextEntry
      />
      {passwordError ? <Text>{passwordError}</Text> : null}
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default Register;

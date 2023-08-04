import React, {useState} from 'react';
import {
  Alert,
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';
import validator from 'validator';
const fetch = require('node-fetch');

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
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');

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

    // Submit to your API using fetch
    console.log(
      'Name: ' + name + '\nUsername' + email + '\nPassword' + password,
    );
    try {
      const response = await fetch(
        'http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/Register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({name, username: email, password}),
        },
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      if (data.message === 'User already exists') {
        Alert.alert('User already Registered');
      } else if (data.message === 'User registered successfully') {
        navigation.navigate('Login');
      } else {
        Alert.alert('Something Went Wrong Please Try Again');
      }
    } catch (error) {
      console.log('Error performing network request:', error);
      // Handle error here, e.g., show error message to the user
      Alert.alert('Error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.registerLogo}
          source={require('./icons/regIcon.png')}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (text.length > 5 && !validator.isEmail(text)) {
            setEmailError('Please enter a valid email');
          } else {
            setEmailError('');
          }
        }}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  registerLogo: {
    width: 100,
    height: 150,
  },
  error: {color: '#FFA500'},

  submitButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
  },
  submitButtonText: {
    color: 'black',
    fontSizez: 16,
  },
});

export default Register;

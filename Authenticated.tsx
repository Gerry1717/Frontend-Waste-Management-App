import React from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';
import * as Keychain from 'react-native-keychain';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 50, // add bottom padding to ensure the button bar is visible
  },
  bottomNav: {
    position: 'absolute', // use absolute positioning
    bottom: 0, // position at the bottom of the screen
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // use full width of the screen
    padding: 10, // add some padding around the buttons
    backgroundColor: '#f8f8f8', // optional: add a background color
  },
  navButton: {
    flex: 1, // this ensures that the buttons take up equal amounts of space
    marginHorizontal: 5, // add some margin between the buttons
  },
});

const Home: React.FC<Props> = ({navigation}) => {
  const handleLogout = async () => {
    // Clear the stored credentials
    await Keychain.resetGenericPassword();
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <View style={styles.container}>
      <View style={{position: 'absolute', right: 9, top: 10}}>
        <Menu>
          <MenuTrigger text="Menu" />
          <MenuOptions>
            <MenuOption onSelect={handleLogout} text="Logout" />
          </MenuOptions>
        </Menu>
      </View>
      <Text>Content Here</Text>
      <View style={styles.bottomNav}>
        <View style={styles.navButton}>
          <Button
            title="Fridge"
            onPress={() => navigation.navigate('Fridge')}
          />
        </View>
        <View style={styles.navButton}>
          <Button title="Scan" onPress={() => navigation.navigate('Scan')} />
        </View>
        <View style={styles.navButton}>
          <Button
            title="Profile"
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;

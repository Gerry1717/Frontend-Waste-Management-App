import React, {useState, useEffect} from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';

type FridgeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Fridge'
>;

type Props = {
  navigation: FridgeScreenNavigationProp;
};

const Fridge: React.FC<Props> = ({navigation}) => {
  const [items, setItems] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  // Fetching items from fridge (hardcoded here for simplicity)
  useEffect(() => {
    setItems(['Milk      Expiry: 25/07/2023', 'Bread', 'Cheese', 'Butter', 'Ham']);
  }, []);

  // Filtering items when searchText changes
  useEffect(() => {
    setFilteredItems(
      items.filter(item =>
        item.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  }, [searchText, items]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        onChangeText={setSearchText}
        value={searchText}
        placeholder="Search items..."
      />
      <FlatList
        data={filteredItems}
        renderItem={({item}) => (
          <Text style={styles.item} onPress={() => setSelectedItem(item)}>
            {item}
          </Text>
        )}
        keyExtractor={item => item}
      />
      <Button
        title="Edit Selected Item"
        onPress={() => navigation.navigate('EditItem', {item: selectedItem})}
        disabled={selectedItem === null}
      />
      <Button
        title="Add New Item"
        onPress={() => navigation.navigate('AddItem')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default Fridge;

import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';
import styles from './GlobalStyles';
import FridgeAddPopup from './FridgePopupAddItem';
import FridgeEditPopup from './FridgePopupEditItem';

type FridgeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Fridge'
>;

type Props = {
  navigation: FridgeScreenNavigationProp;
};

const Fridge: React.FC<Props> = ({navigation}) => {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [popuplVisible, setPopuplVisible] = useState(false);

  const fetchData = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'user',
      });
      if (credentials && credentials.password) {
        fetch(
          'http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/user-fridge-items',
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
            setItems(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });

        // fetch the products
        fetch(
          'http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/products',
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
            setProducts(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredItems(
      items.filter(item =>
        item.item.toLowerCase().includes(searchText.toLowerCase()),
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
          <View>
            <Text
              style={styles.expiryDateTitle}
              onPress={() => setSelectedItem(item)}>
              {item.item}
            </Text>
            <Text style={styles.expiryDateText}>
              Expiry: {new Date(item.expiry).toLocaleDateString()}
            </Text>
          </View>
        )}
        keyExtractor={item => item._id}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => setPopuplVisible(true)}
        disabled={selectedItem === null}>
        <Text style={styles.submitButtonText}>Edit Selected Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.submitButtonText}>Add New Item</Text>
      </TouchableOpacity>
      <FridgeAddPopup
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onAddSuccess={fetchData}
        catalogueProducts={products}
      />
      <FridgeEditPopup
        modalVisible={popuplVisible}
        setModalVisible={setPopuplVisible}
        catalogueProducts={products}
        itemToUpdate={selectedItem}
      />
    </View>
  );
};

export default Fridge;

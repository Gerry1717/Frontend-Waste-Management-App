import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import styles from './GlobalStyles';
import CataloguePopup from './CataloguePopupAddNew'; // Import the component, adjust the path accordingly
import CataloguePopupEditExisting from './CataloguePopupEditExisting'; // Import the component, adjust the path accordingly

const Catalogue = ({route}) => {
  const [search, setSearch] = useState(route.params?.barcode || '');
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectItem = item => {
    setSelectedItem(item);
  };

  const handleEditofExistingItem = () => {
    if (selectedItem) {
      setIsEditing(true);
    } else {
      Alert.alert('No product selected');
    }
  };

  const fetchData = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'user',
      });

      if (credentials && credentials.password) {
        console.log('Credentials: ', credentials);

        const response = await fetch(
          'http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/products',
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + credentials.password,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          console.log('Server responded with an error');
          throw new Error('Server responded with an error');
        }

        const data = await response.json();
        console.log(data);

        const transformedProducts = data.map(product => ({
          _id: product._id,
          title: product.name,
          subtitle: product.barcode,
        }));

        setProducts(transformedProducts);
        setToken(credentials.password); // saving the token for future API calls
      }
    } catch (error) {
      console.log('Error fetching credentials from Keychain:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [refreshData]);

  const filteredProducts = products.filter(product => {
    const titleMatch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const barcodeMatch = product.subtitle
      .toString()
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return titleMatch || barcodeMatch;
  });
  const handleAddNew = product => {
    if (!token) {
      console.log('No token available');
      return;
    }

      fetch('http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/add-to-catalogue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(product),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setRefreshData(prevRefreshData => prevRefreshData + 1); // increment refreshData to trigger fetchData
        setSelectedItem(null);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // on click of edit button
  const handleEditExisting = updatedProduct => {
      fetch('http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/edit-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(updatedProduct),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setRefreshData(prevRefreshData => prevRefreshData + 1); // increment refreshData to trigger fetchData
        setIsEditing(false); // close the edit modal
        setSelectedItem(null); // deselect the item
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // Function to handle the "Delete" button press
  const handleDelete = () => {
    if (selectedItem) {
      Alert.alert(
        'Confirm Close',
        'Are you sure you Delete This Item: ' + selectedItem.title,
        [
          {
            text: 'Cancel',
            onPress: () => {
              return;
            }, // Do nothing, just return
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              // Implement your logic here to delete the selected on-screen item
                fetch('http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/catalogue-delete-product', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  // Make sure to include the Authorization header with your token
                  Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({barcode: selectedItem.subtitle}),
              })
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                  setRefreshData(prevRefreshData => prevRefreshData + 1); // increment refreshData to trigger fetchData\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                  setSelectedItem(null);
                })
                .catch(error => {
                  console.error('Error:', error);
                });
            },
          },
        ],
      );
    } else {
      Alert.alert('No product selected');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
      />
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          numColumns={3}
          keyExtractor={item => item.subtitle}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <TouchableOpacity onPress={() => handleSelectItem(item)}>
                <Image
                  style={styles.image}
                  source={{
                    uri: 'https://via.placeholder.com/100',
                  }}
                />
                <Text
                  style={styles.productPageItemtitle}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.hideBarcodeandISBN}>ID:{item._id}</Text>
                <Text style={styles.hideBarcodeandISBN}>{item.subtitle}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.message}>No products found!</Text>
      )}
      {/* Three static buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Add New</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            handleEditofExistingItem(/* Pass your product and barcode here */)
          }>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDelete(/* Pass your barcode here */)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <CataloguePopup
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onCatalogueSubmit={handleAddNew}
      />
      <CataloguePopupEditExisting
        modalVisible={isEditing}
        setModalVisible={setIsEditing}
        onCatalogueSubmit={handleEditExisting}
        product={selectedItem} // Pass the selected product to the component
      />
    </View>
  );
};

export default Catalogue;

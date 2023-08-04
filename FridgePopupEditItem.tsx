import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import {
  Modal,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';
import Keychain from 'react-native-keychain';
import styles from './GlobalStyles';

const CataloguePopup = ({
  modalVisible,
  setModalVisible,
  catalogueProducts,
  itemToUpdate,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [date, setDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (itemToUpdate && itemToUpdate.product && itemToUpdate.date) {
      const product = catalogueProducts.find(
        p => p.name === itemToUpdate.product,
      );
        setSelectedItem(itemToUpdate);
        setDate(selectedItem.expiry);
    }
  }, [itemToUpdate, catalogueProducts]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setDatePickerVisible(false);
  };

  const editExpiryDate = async () => {
    const matchingProduct = catalogueProducts.find(
      product => product.name === itemToUpdate.item,
    );

    if (matchingProduct && matchingProduct.barcode) {
      const credentials = await Keychain.getGenericPassword({
        service: 'user',
      });

      // Format the date in 'YYYY-MM-DD' format
      const newExpiry = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        fetch('http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/update-expiry', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + credentials.password,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //barcode: matchingProduct.barcode,
          productName: itemToUpdate.item,
          newExpiry: newExpiry, // use the newly formatted date
        }),
      })
        .then(response => response.json())
        .then(data => {
          Alert.alert(
            'Name: ' + itemToUpdate.item + 'Data: ' + JSON.stringify(data),
          );
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else if (matchingProduct) {
      Alert.alert('Barcode not found for the selected product');
    } else {
      Alert.alert('No matching product found in the catalogue');
    }
  };

  return (
    <View style={{marginTop: 22}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.popupContainer}>
          <View>
            <Text style={styles.fridgePopupTitle}>Update Fridge Item</Text>

            

            <Text style={styles.inputLabel}>Enter Products Expiry Date:</Text>
            <TextInput
              style={styles.fridgePopupInput}
              editable={true}
              value={date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
              onTouchStart={() => setDatePickerVisible(true)}
            />

            <View style={styles.groupTwoButtons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  editExpiryDate();
                  setModalVisible(false);
                }}>
                <Text style={styles.submitButtonText}>Update Item</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Text style={styles.submitButtonText}>Close Popup</Text>
              </TouchableOpacity>
            </View>
            {datePickerVisible && (
              <DatePicker
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CataloguePopup;

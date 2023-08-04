import React, {useState} from 'react';
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
  onAddSuccess,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [date, setDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setDatePickerVisible(false);
  };

  const addNewItem = async () => {
    const credentials = await Keychain.getGenericPassword({
      service: 'user',
    });
    if (selectedProduct && date) {
      fetch(
        'http://waste-management-app.eba-ygxewpyg.eu-west-2.elasticbeanstalk.com/api/user-add-fridge-item',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + credentials.password,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item: selectedProduct.name,
            expiry: date,
          }),
        },
      )
        .then(response => response.json())
        .then(data => {
          onAddSuccess(); // call callback
          setModalVisible(false);
          setSelectedProduct(null);
        })
        .catch(error => {
          console.error('Error:', error);
        });
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
            <Text style={styles.fridgePopupTitle}>Add a New Fridge item</Text>

            <Text style={styles.popupInputTitle}>Product:</Text>
            <Picker
              style={styles.popupInput}
              selectedValue={selectedProduct}
              onValueChange={itemValue => setSelectedProduct(itemValue)}>
              {catalogueProducts.map((product, index) => (
                <Picker.Item key={index} label={product.name} value={product} />
              ))}
            </Picker>

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
                onPress={addNewItem}>
                <Text style={styles.submitButtonText}>Add New Item</Text>
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

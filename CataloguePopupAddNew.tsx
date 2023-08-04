import React, {useState} from 'react';
import {
  Modal,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import styles from './GlobalStyles';

const CataloguePopup = ({modalVisible, setModalVisible, onCatalogueSubmit}) => {
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.popupContainer}>
          <View>
            <Text style={{fontSize: 20, marginBottom: 20, color: 'white'}}>
              Add to Catalogue
            </Text>

            <Text style={styles.popupInputTitle}>Name: </Text>

            <TextInput
              style={styles.popupInput}
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.popupInputTitle}>Barcode: </Text>
            <TextInput
              style={styles.popupInput}
              value={barcode}
              onChangeText={setBarcode}
            />

            <View style={styles.groupTwoButtons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  const product = {
                    name: name,
                    barcode: barcode,
                  };

                  onCatalogueSubmit(product); // Now the function will receive an object with 'name' and 'barcode'
                  setModalVisible(false);
                  setName('');
                  setBarcode('');
                }}>
                <Text style={styles.buttonText}>Add Item</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Text style={styles.submitButtonText}>Close Popup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CataloguePopup;

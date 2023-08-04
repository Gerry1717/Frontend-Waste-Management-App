import React, {useState, useEffect} from 'react';
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

const CataloguePopup = ({
  modalVisible,
  setModalVisible,
  onCatalogueSubmit,
  product,
}) => {
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [productId, setProductId] = useState('');
  const [hasBeenEdited, setHasBeenEdited] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.title);
      setBarcode(product.subtitle);
      setProductId(product._id);
    }
  }, [product]);

  return (
    <View style={{marginTop: 22}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View
          style={{
            marginTop: 50,
            padding: 20,
            backgroundColor: 'black',
            alignItems: 'center',
            minHeight: '60%',
          }}>
          <View>
            <Text style={{fontSize: 20, marginBottom: 20, color: 'white'}}>
              Edit a Catalogue item
            </Text>

            <Text style={styles.popupInputTitle}>ID: {productId} </Text>

            <Text style={styles.popupInputTitle}>Name: </Text>

            <TextInput
              style={styles.popupInput}
              value={name}
              onChangeText={text => {
                setName(text);
                setHasBeenEdited(true);
              }}
            />
            <Text style={styles.popupInputTitle}>Barcode: </Text>
            <TextInput
              style={styles.popupInput}
              value={barcode}
              onChangeText={text => {
                setBarcode(text);
                setHasBeenEdited(true);
              }}
            />

            <View style={styles.groupTwoButtons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  const editedProduct = {
                    _id: productId,
                    name: name,
                    barcode: barcode,
                  };
                  onCatalogueSubmit(editedProduct);
                  setModalVisible(false);
                  setProductId('');
                  setName('');
                  setBarcode('');
                  setHasBeenEdited(false); // Add this line
                }}>
                <Text style={styles.buttonText}>Edit Item</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  if (hasBeenEdited) {
                    Alert.alert(
                      'Confirm Close',
                      'Are you sure you want to close? All unsaved changes will be lost.',
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
                            setModalVisible(false);
                            setHasBeenEdited(false);
                          },
                        },
                      ],
                    );
                  } else {
                    Alert.alert('Nothing has been Changed!');
                    setModalVisible(false);
                  }
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

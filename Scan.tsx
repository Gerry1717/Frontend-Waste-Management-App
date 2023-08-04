import React, {useState} from 'react';
import {View, StyleSheet, Alert, StyleProp, ViewStyle} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';

type ScanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;

interface ScanProps {
  navigation: ScanScreenNavigationProp;
  style?: StyleProp<ViewStyle>;
}

const Scan: React.FC<ScanProps> = ({navigation, style}) => {
  const [isBarcodeAlertShown, setBarcodeAlertShown] = useState(false);

  const onBarcodeRead = (barcode: any) => {
    if (!isBarcodeAlertShown && barcode.data) {
      setBarcodeAlertShown(true);

      Alert.alert(
        'Barcode value is ' + barcode.data,
        'Barcode type is ' + barcode.type,
        [
          {
            text: 'Search',
            onPress: () => {
              navigation.reset({
                index: 1,
                routes: [
                  {name: 'Home'},
                  {name: 'Catalogue', params: {barcode: barcode.data}},
                ],
              });
              setTimeout(() => setBarcodeAlertShown(false), 1000);
            },
          },
        ],
      );
    }
  };

  return (
    <View style={[styles.container, style]}>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        onBarCodeRead={onBarcodeRead}
        captureAudio={false}>
        <BarcodeMask edgeColor={'#62B1F6'} showAnimatedLine={false} />
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default Scan;

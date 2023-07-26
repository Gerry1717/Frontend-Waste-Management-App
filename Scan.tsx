import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';

type ScanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;

interface Props {
  navigation: ScanScreenNavigationProp;
}

const Scan: React.FC<Props> = ({navigation}) => {
  const onBarcodeRead = (barcode: any) => {
    Alert.alert(
      'Barcode value is ' + barcode.data,
      'Barcode type is ' + barcode.type,
    );
  };

  return (
    <View style={styles.container}>
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

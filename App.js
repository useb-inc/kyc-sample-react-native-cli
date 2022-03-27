import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, RESULTS, request, check } from 'react-native-permissions';
import Example from './Example';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraGranted: false,
    }

    this.handleCameraPermission();
  };

  handleCameraPermission = async () => {
    if (Platform.OS === 'android') {
      // Calling the permission function
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Example App Camera Permission',
          message: 'Example App needs access to your camera',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setCameraGranted(true);
      } else {
        this.setCameraGranted(false);
      }
      
    } else if(Platform.OS = 'ios') {
      const res = await check(PERMISSIONS.IOS.CAMERA);

      if (res === RESULTS.GRANTED) {
        this.setCameraGranted(true);
      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.CAMERA);
        if (res2 === RESULTS.GRANTED) {
          this.setCameraGranted(true)
        } else {
          this.setCameraGranted(false);
        }
      }
    } else {
      this.setCameraGranted(true)
    }
  }

  setCameraGranted = (value) => {
    console.log("setCameraGranted : ", value);
    alert("setCameraGranted : " + value);
    this.setState({ cameraGranted : value })
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.cameraGranted && 
        <Example />
        }
        { !this.state.cameraGranted && 
        <Text>카메라 권한이 없습니다. 권한 허용 후 이용해주세요.</Text>
        }
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30
  },
  webview: {
    flex: 1
  }
});
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import Example from './Example';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraGranted: false,
    }
  }

  handleCameraGranted = (e) => {
    this.setState({ cameraGranted : true })
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.cameraGranted && <Example />}
        { !this.state.cameraGranted && 
        <View style={styles.container}>
          <Text>카메라 권한이 없습니다. 권한 허용 후 이용해주세요.</Text>
          <Button
            onPress={this.handleCameraGranted}
            title="카메라 권한 요청"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
            
          />
        </View>
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
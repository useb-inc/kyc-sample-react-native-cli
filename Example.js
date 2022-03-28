import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';
import {WebView} from 'react-native-webview';

class Example extends Component {
  constructor(props) {
    super(props);

    this.appWebview = null;
    this.domain = 'https://kyc.useb.co.kr/auth';

    this.state = {
      progress: 'toDo', // "toDo", "inProgress", "done"
      indexPage: {uri: this.domain + '?ver=1'},
      webViewVisible: false,
      name: '',
      birthday_yyyy: '',
      birthday_mm: '',
      birthday_dd: '',
      phone_number: '',
      email: '',
      evt_result: '',
      rsp_review_result: '',
      rsp_result: '',
    };
  }

  startButtonHandler = () => {
    if (
      !this.state.name ||
      !this.state.birthday_yyyy ||
      !this.state.birthday_mm ||
      !this.state.birthday_dd ||
      !this.state.phone_number ||
      !this.state.email
    ) {
      alert('필수 정보가 입력되지 않았습니다.');
      this.restartButtonHandler();
      return;
    }

    this.setState({progress: 'inProgress', webViewVisible: true});
  };

  restartButtonHandler = () =>
    this.setState({
      webViewVisible: false,
      progress: 'toDo',
      evt_result: '',
      rsp_result: '',
      rsp_review_result: '',
    });

  doneProcessHandler = msgData => {
    if (msgData?.review_result) {
      if (msgData?.review_result?.id_card?.id_card_image) {
        msgData.review_result.id_card.id_card_image =
          msgData.review_result.id_card.id_card_image.substring(0, 20) +
          '...생략...';
      }
      if (msgData?.review_result?.id_card?.id_card_origin) {
        msgData.review_result.id_card.id_card_origin =
          msgData.review_result.id_card.id_card_origin.substring(0, 20) +
          '...생략...';
      }
      if (msgData?.review_result?.id_card?.id_crop_image) {
        msgData.review_result.id_card.id_crop_image =
          msgData.review_result.id_card.id_crop_image.substring(0, 20) +
          '...생략...';
      }
      if (msgData?.review_result?.face_check?.selfie_image) {
        msgData.review_result.face_check.selfie_image =
          msgData.review_result.face_check.selfie_image.substring(0, 20) +
          '...생략...';
      }

      this.setState({
        rsp_result: JSON.stringify(msgData.result),
        rsp_review_result: JSON.stringify(msgData.review_result),
      });
    } else if (msgData?.result) {
      this.setState({evt_result: JSON.stringify(msgData.result)});

      this.setState({webViewVisible: true, progress: 'done'});
    }
  };

  handleName = text => this.setState({name: text});
  handleBirthdayYYYY = text => this.setState({birthday_yyyy: text});
  handleBirthdayMM = text => this.setState({birthday_mm: text});
  handleBirthdayDD = text => this.setState({birthday_dd: text});
  handlePhoneNumber = text => this.setState({phone_number: text});
  handleEmail = text => this.setState({email: text});

  render() {
    return (
      <View style={styles.container}>
        {this.state.progress === 'toDo' && (
          <View>
            <Button
              onPress={this.startButtonHandler}
              title="Start"
              color="blue"
            />
            <Text>이름</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="blue"
              placeholder="홍길동"
              placeholderTextColor="gray"
              autoCapitalize="none"
              onChangeText={this.handleName}
              value={this.state.name}
            />

            <Text>생년월일(YYYY-MM-DD)</Text>
            <View style={styles.birthdayContainer}>
              <TextInput
                style={styles.birthdayInput}
                underlineColorAndroid="blue"
                placeholder="YYYY"
                placeholderTextColor="gray"
                autoCapitalize="none"
                onChangeText={this.handleBirthdayYYYY}
                value={this.state.birthday_yyyy}
                keyboardType="number-pad"
                maxLength={4}
              />
              <Text>-</Text>
              <TextInput
                style={styles.birthdayInput}
                underlineColorAndroid="blue"
                placeholder="MM"
                placeholderTextColor="gray"
                autoCapitalize="none"
                onChangeText={this.handleBirthdayMM}
                value={this.state.birthday_mm}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text>-</Text>
              <TextInput
                style={styles.birthdayInput}
                underlineColorAndroid="blue"
                placeholder="DD"
                placeholderTextColor="gray"
                autoCapitalize="none"
                onChangeText={this.handleBirthdayDD}
                value={this.state.birthday_dd}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            <Text>전화번호 ("-" 없이 입력)</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="blue"
              placeholder="01012345678"
              placeholderTextColor="gray"
              autoCapitalize="none"
              onChangeText={this.handlePhoneNumber}
              value={this.state.phone_number}
              keyboardType="numeric"
              maxLength={11}
            />
            <Text>이메일</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="blue"
              placeholder="email@address.com"
              placeholderTextColor="gray"
              autoCapitalize="none"
              onChangeText={this.handleEmail}
              value={this.state.email}
              keyboardType="email-address"
            />
          </View>
        )}
        {this.state.progress === 'inProgress' && (
          <WebView
            style={styles.webview}
            source={this.state.indexPage}
            originWhitelist={['*']}
            ref={webview => (this.appWebview = webview)}
            javaScriptEnabled={true}
            useWebKit={true}
            mediaPlaybackRequiresUserAction={false}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            startInLoadingState={true}
            allowUniversalAccessFromFileURLs={true}
            onMessage={this.onReceivedWebViewMessage}
            onLoadEnd={this.onWebViewLoadEnd}
          />
        )}
        {this.state.progress === 'done' && (
          <View>
            <Button
              onPress={this.restartButtonHandler}
              title="Restart"
              color="blue"
            />

            <Text>이벤트</Text>
            <ScrollView
              style={{
                minHeight: 100,
                maxHeight: '20%',
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: 'blue',
              }}>
              <Text>result : {this.state.evt_result}</Text>
            </ScrollView>

            <Text>상세결과</Text>
            <ScrollView
              style={{
                minHeight: 300,
                maxHeight: '60%',
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: 'blue',
              }}>
              <Text>result : {this.state.rsp_result}</Text>
              <Text>review_result : {this.state.rsp_review_result}</Text>
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  onWebViewLoadEnd = () => {
    console.log('onWebViewLoadEnd');
    // const customer_id = "9";       // idcard
    const customer_id = '12'; // all
    // const customer_id = "13";       // account
    let params = {
      customer_id: customer_id,
      id: 'demoUser',
      key: 'demoUser0000!',
    };
    params.name = this.state.name;
    params.birthday = [
      this.state.birthday_yyyy,
      this.state.birthday_mm,
      this.state.birthday_dd,
    ].join('-');
    params.phone_number = this.state.phone_number;
    params.email = this.state.email;

    let encodedParams = Base64.btoa(encodeURIComponent(JSON.stringify(params)));
    this.sendWebViewPostMessage(encodedParams);
  };

  /**
   * 화면에서 post를 던지면 react-native에서 받음
   */
  sendWebViewPostMessage = message => {
    console.log('sendWebViewPostMessage', message);
    // console.log("sendWebViewPostMessage (decoded)", decodeURIComponent(Base64.atob(message)));
    this.appWebview.postMessage(message);
  };

  /**
   * 화면에서 post를 던지면 react-native에서 받음
   */
  onReceivedWebViewMessage = event => {
    console.log('onReceivedWebViewMessage', event.nativeEvent.data);
    const decodedMsg = decodeURIComponent(Base64.atob(event.nativeEvent.data));
    // console.log('onReceivedWebViewMessage (decode)', decodedMsg);

    let msgData;
    try {
      msgData = JSON.parse(decodedMsg) || {};
      this.doneProcessHandler(msgData);
    } catch (error) {
      console.error(error);
      return;
    }
    // console.log('msgData : ', JSON.stringify(msgData));
    // this[msgData.targetFunc].apply(this, [msgData]);
  };
}

const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
  btoa: (input = '') => {
    let str = input;
    let output = '';

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded.",
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '10%',
  },
  webview: {
    flex: 1,
  },
  birthdayContainer: {
    flexDirection: 'row',
    minHeight: 20,
  },
  birthdayInput: {
    width: '32%',
  },
});

export default Example;

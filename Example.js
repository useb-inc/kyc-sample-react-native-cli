import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';

class Example extends Component {
    constructor(props) {
        super(props);

        this.appWebview = null;
        this.domain = "https://kyc-int.useb.co.kr/auth";

        this.state = {
            progress : "toDo",      // "toDo", "inProgress", "done"
            indexPage: { uri: this.domain + '?ver=1' },
            webViewVisible: false,
            name: "",
            birthday: "",
            phone_number: "",
            email: "",
            responsedData: "",
        };
    }

    startButtonHandler = () => {
        if (!this.state.name || !this.state.birthday || !this.state.phone_number || !this.state.email) {
            alert('필수 정보가 입력되지 않았습니다.');
            this.restartButtonHandler();
            return;
        }
        
        this.setState({ progress: "inProgress", webViewVisible: true });
    }

    restartButtonHandler = () => this.setState({ webViewVisible: false, progress: "toDo", responsedData: "" });
    doneProcessHandler = (msgData) => this.setState({ webViewVisible: true, progress: "done", responsedData: msgData });
    
    handleName = text => this.setState({ name: text });
    handleBirthday = text => this.setState({ birthday: text });
    handlePhoneNumber = text => this.setState({ phone_number: text });
    handleEmail = text => this.setState({ email: text });

    render() {
        return (
            <View style={styles.container}>
                { this.state.progress === "toDo" && 
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
                    <Text>생년월일</Text>
                    <TextInput
                        style={styles.input}
                        underlineColorAndroid="blue"
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                        onChangeText={this.handleBirthday}
                        value={this.state.birthday}
                        keyboardType="decimal-pad"
                    />
                    <Text>전화번호</Text>
                    <TextInput
                        style={styles.input}
                        underlineColorAndroid="blue"
                        placeholder="01012345678"
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                        onChangeText={this.handlePhoneNumber}
                        value={this.state.phone_number}
                        keyboardType="phone-pad"
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
                }
                { this.state.progress === "inProgress" && 
                <WebView
                    style={styles.webview}
                    source={this.state.indexPage}
                    originWhitelist={['*']}
                    ref={webview => this.appWebview = webview}
                    javaScriptEnabled={true}
                    useWebKit={true}

                    mediaPlaybackRequiresUserAction={false}
                    domStorageEnabled={true}
                    allowsInlineMediaPlayback={true}
                    startInLoadingState={true}
                    allowUniversalAccessFromFileURLs={true}
                    onMessage={this.onWebViewMessage}
                    onLoadEnd={this.onWebViewLoadEnd}
                />
                }
                { this.state.progress === "done" &&
                <View>
                    <Button
                        onPress={this.restartButtonHandler}
                        title="Restart"
                        color="blue"
                    />
                    <Text>결과 : {this.state.responsedData}</Text>
                </View>
                }
            </View>
        );
    }

    onWebViewLoadEnd = () => {
        let params = { "customer_id": "9", "id": "demoUser", "key": "demoUser0000!" };
        params.name = this.state.name;
        params.birthday = this.state.birthday;
        params.phone_number = this.state.phone_number;
        params.email = this.state.email;

        let encodedParams = Base64.btoa(encodeURIComponent(JSON.stringify(params)));
        this.sendWebViewPostMessage(encodedParams)
    }

    /**
     * 화면에서 post를 던지면 react-native에서 받음
     */
    sendWebViewPostMessage = message => {
        
        console.log('sendWebViewPostMessage', message);
        alert("sendMsg : " + message);
        alert("sendMsg Original : " + decodeURIComponent(Base64.atob(message)));
        this.appWebview.postMessage(message);
    }

    /**
     * 화면에서 post를 던지면 react-native에서 받음
     */
    onWebViewMessage = event => {
        console.log('onWebViewMessage', event.nativeEvent.data);
        const decodedMsg = decodeURIComponent(Base64.atob(event.nativeEvent.data));
        console.log('decodedMsg', decodedMsg);
        alert('decodedMsg : ' + decodedMsg);

        this.doneProcessHandler(decodedMsg);

        let msgData;
        
        try {
            msgData = JSON.parse(decodedMsg) || {}
        } catch (error) {
            console.error(error)
            return
        }
        alert('msgData : ' + JSON.stringify(msgData));
        // this[msgData.targetFunc].apply(this, [msgData]);
    }

}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
    btoa: (input = '') => {
        let str = input;
        let output = '';

        for (let block = 0, charCode, i = 0, map = chars;
            str.charAt(i | 0) || (map = '=', i % 1);
            output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

            charCode = str.charCodeAt(i += 3 / 4);

            if (charCode > 0xFF) {
                throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
            }

            block = block << 8 | charCode;
        }

        return output;
    },

    atob: (input = '') => {
        let str = input.replace(/=+$/, '');
        let output = '';

        if (str.length % 4 == 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        for (let bc = 0, bs = 0, buffer, i = 0;
            buffer = str.charAt(i++);

            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
            buffer = chars.indexOf(buffer);
        }

        return output;
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

export default Example;
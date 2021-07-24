import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview'

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true}></StatusBar>
      <WebView
        // source={{uri: 'http://cctv.sbs.co.kr/map'}}
        source={{uri: 'http://www.youtube.com'}}
        style={{marginTop: 10, marginBottom: 10}}
      >
      </WebView>
    </View>

  );
}
import React, {useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import {WebView} from 'react-native-webview';

const styles = StyleSheet.create({
    leftAbsolutePanel: {
      flex: 1,
      alignItems: 'center',
      position: 'absolute',
      left: 20,
      bottom: 10,
      opacity: 1,
      zIndex: 9999,
      height: 'auto',
      padding: 10,
      width: 130
    },
    drawToggleBtn:{
      paddingHorizontal: 10,
      paddingTop: 1,
      paddingBottom: 3,
      borderRadius: 4
    }
});
const WebViewCommon = props => {
    const {source, navigation, route} = props;
    const gotoPage = React.useCallback(() => {
        if(route.name === 'CCTV'){
            navigation.navigate('Weather');
        } else {
            navigation.navigate('CCTV');
        }
    },[route, navigation])
    const btnText = route.name === 'CCTV' ? 'Weather' : 'CCTV';
    return (
        <>
            <WebView
                source={source}
            >
            </WebView>

            <View style={{...styles.leftAbsolutePanel, backgroundColor:'transparent', opacity:0.8}}>
                <View style={{flex: 1}} >
                <TouchableOpacity
                    style={{...styles.drawToggleBtn, backgroundColor:'darkslategrey'}}
                    onPress={gotoPage}                >
                    <Text style={{fontSize:18, color:'white'}}>{btnText}</Text>
                </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default React.memo(WebViewCommon)



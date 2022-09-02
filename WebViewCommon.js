import React, {startTransition, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import {WebView} from 'react-native-webview';

const styles = StyleSheet.create({
    drawToggleBtn:{
      paddingHorizontal: 10,
      paddingTop: 1,
      paddingBottom: 3,
      marginRight: 5,
      borderRadius: 4
    }
});

const dStyles = StyleSheet.create({
    leftAbsolutePanel: {
      flex: 1,
      justifyContent: 'flex-start',
      position: 'absolute',
      left: 90,
      bottom: 5,
      opacity: 1,
      zIndex: 9999,
      height: 'auto',
      padding: 10
    },
})
const pageNames =['CCTV', 'Weather', 'Earth'];
const WebViewCommon = props => {
    const {source, navigation, route} = props;
    const currentPage = route.name; // 'CCTV', 'Weahert' or 'Earth
    const targetPages = React.useMemo(() => { 
        return pageNames.filter(pageName => pageName !== currentPage);
    },[currentPage]);

    const gotoPage = React.useCallback(pageName => {
        return event => {
            navigation.navigate(pageName);
        }
    },[navigation])
        
    return (
        <>
            <WebView
                source={source}
            >
            </WebView>

            <View 
             style={{...dStyles.leftAbsolutePanel, backgroundColor:'transparent', opacity:0.8}}
            >
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}} >
                    {pageNames.map(pageName => (
                        <TouchableOpacity
                            style={{...styles.drawToggleBtn, backgroundColor:'darkslategrey'}}
                            onPress={gotoPage(pageName)}
                        >
                            <Text style={{fontSize:18, color:'white'}}>{pageName}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </>
    )
}

export default React.memo(WebViewCommon)



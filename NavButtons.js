import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
    drawToggleBtn:{
      paddingHorizontal: 10,
      paddingTop: 1,
      paddingBottom: 1,
      marginRight: 5,
      borderRadius: 4,
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

const NavButtons = props => {
    const {pageNames, drawMode} = props;
    const navigation = useNavigation();

    const gotoPage = React.useCallback(pageName => {
        return event => {
            navigation.navigate(pageName);
        }
    },[navigation]) 
        
    return (
        <>
            <View 
             style={{...dStyles.leftAbsolutePanel, backgroundColor:'transparent', opacity:0.8}}
            >
                <View style={{
                    flex: 1, 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-around',
                    opacity: drawMode ? 0.1 : 1,
                    height: 25,
                }} >
                    {pageNames.map(pageName => (
                        <TouchableOpacity
                            style={{
                                ...styles.drawToggleBtn, 
                                // flex: 1,
                                // flexDirection: 'column',
                                backgroundColor: drawMode ? 'lightgrey':'darkslategrey',
                                height: '100%',
                                minWidth: 60
                            }}
                            onPress={gotoPage(pageName)}
                        >
                            <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
                            <Text style={{fontSize:18, color:'white'}}>{pageName}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </>
    )
}

export default React.memo(NavButtons)

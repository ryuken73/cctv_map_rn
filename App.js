import { StatusBar } from 'expo-status-bar';
import React, {useRef, useState} from 'react';``
import {reloadAsync} from "expo-updates";
import { StyleSheet, Text, Dimensions, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
// import { WebView } from 'react-native-webview';
import Svg,{Polyline, Path} from 'react-native-svg';
import GestureRecorderContainer from './GestureRecorderContainer';
import IconButton from './IconButton';
import ColorPicker from './ColorPicker';
import WebViewCommon from './WebViewCommon';
import NavButtons from './NavButtons';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
// import { NavigationContainer, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import * as d3 from 'd3'
import MaterialIconButton from './MaterialIconButton';
import ColorPickerSmall from './ColorPickerSmall';
import IoniconButton from './IoniconButton';

const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const navigationRef = createNavigationContainerRef();
const CURVE_LEVEL = 1;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'transparent',
    width: "100%",
    zIndex: 9998
    
  },
  rightAbsolutePanel: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 20,
    opacity: 1,
    zIndex: 9998,
    height: 'auto',
    padding: 10,
    width: 110
  },
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
  },
  drawOptionContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// const pageNames =['CCTV', 'Weather', 'Earth', '제주'];
const pageNames =['CCTV', 'Weather', 'Earth'];
const Weather = ({navigation, route}) => {
  return <WebViewCommon
            source={{uri: 'https://www.weather.go.kr/wgis-nuri/html/map.html'}}
            navigation={navigation}
            route={route}
          >
          </WebViewCommon>
}
const Earth = ({navigation, route}) => {
  return <WebViewCommon
            source={{uri: 'https://earth.nullschool.net/ko/#current/wind/surface/level/orthographic=-232.88,37.51,2250'}}
            navigation={navigation}
            route={route}
          >
          </WebViewCommon>
}
const CCTV = ({navigation, route}) => {
  return <WebViewCommon
            source={{uri: 'http://cctvmap.sbs.co.kr/map'}}
            navigation={navigation}
            route={route}
            setBuiltInZoomControls={true}
          >
          </WebViewCommon>
}
// const JEJU = ({navigation, route}) => {
//   return <WebViewCommon
//             source={{uri: 'http://bangjae.jeju.go.kr/realtimeinfor/cctv/danger.htm'}}
//             navigation={navigation}
//             route={route}
//           >
//           </WebViewCommon>
// }

export default function App() {
  const [pathContainer, setPathContainer] = useState([[]]);
  const [colorContainer, setColorContainer] = useState([]);
  const [pathIndex, setPathIndex] = React.useState(0);
  const [drawMode, setDrawMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [webViewError, setWebViewError] = useState(false);
  const btnDrawModeText = drawMode ? 'ON':'OFF';
  const btnDrawModeColor = drawMode ? 'darkslategrey':'transparent';
  const btnDrawModeTextColor = drawMode ? 'white':'black';
  const controlBorderWidth = drawMode ? 3:0;
  const controlBackgroundColor = drawMode ? 'midnightblue':'transparent';
  const { width, height } = Dimensions.get('window');

  const onClickToggleDrawMode = React.useCallback(() => {
    //initialize path array
    setPathIndex(0);
    setPathContainer([[]]);
    setColorContainer([]);
    //toggle draw mode
    setDrawMode(drawMode => {
      return !drawMode;
    })
  },[drawMode])

  const onClickClear = React.useCallback(() => {
    setColorContainer([])
    setPathContainer([[]])
    setPathIndex(0)
  })

  const onClickUndo = React.useCallback(() => {
    console.log(pathContainer);
    setColorContainer(colorContainer => {
      if(colorContainer.length < 2){
        return [];
      }
      return [...colorContainer.splice(0, colorContainer.length - 1)]

    })
    setPathContainer(pathContainer => {
      if(pathContainer.length === 1){
        return [[]]
      }
      pathContainer.splice(pathContainer.length-2,1)
      return [...pathContainer]
    })
    setPathIndex(pathIndex => {
      if(pathIndex === 0){
        return 0
      }
      return pathIndex - 1;
    })
  },[pathContainer])

  const onErrorWebView = React.useCallback((error)=>{
    alert(error)
    setWebViewError(true)
  },[])
  const onLoadWebView = React.useCallback(()=>{
    setWebViewError(false)
  },[])

  const toString = path => path.map(p => `${p.x},${p.y}`).join(' ');

  const toSvgPath = d3.line()
                    .x((p) => p.x)
                    .y((p) => p.y)
                    .curve(d3.curveBasis); 

  const transitionSpec = {
    open: TransitionSpecs.FadeInFromBottomAndroidSpec ,
    close: TransitionSpecs.FadeOutFromBottomAndroidSpec ,              
  }
  const options = {
    tabBarStyle: {height:0}
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true}></StatusBar>
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator 
          initialRouteName="CCTV"
          screenOptions={({ route, navigation }) => ({
            headerShown: false,
            gestureEnabled: true
          })}  
        >
          <Tab.Screen 
            name="Weather"       
            options={options}
            component={Weather}   
          />
          <Tab.Screen 
            name="Earth"       
            options={options}
            component={Earth}   
          />
          <Tab.Screen 
            name="CCTV"        
            options={options}
            component={CCTV}  
          />
          {/* <Tab.Screen 
            name="제주"        
            options={options}
            component={JEJU}  
          /> */}
        </Tab.Navigator>
        {!drawMode && <NavButtons pageNames={pageNames} drawMode={drawMode}></NavButtons>}
      </NavigationContainer>
      {drawMode && (
        <View style={[styles.overlay, { height: "100%"}]} >
          <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
          {pathContainer.map((path, index) => (
            <Path
              key={index}
              // points={toString(path)}
              d={toSvgPath(path)}
              fill="none"
              strokeOpacity={1}
              strokeLinejoin="round"
              strokeLinecap="round"
              stroke={strokeColor}
              stroke={colorContainer[index] || 'maroon'}
              strokeWidth={strokeWidth}
            />
          ))}
          </Svg>    
          <GestureRecorderContainer 
            pathContainer={pathContainer} 
            colorContainer={colorContainer}
            setPathContainer={setPathContainer}
            setColorContainer={setColorContainer}
            pathIndex={pathIndex}
            setPathIndex={setPathIndex}
            strokeColor={strokeColor}
          >
          </GestureRecorderContainer>
        </View>
      )}

      <View style={{
        ...styles.rightAbsolutePanel, 
        backgroundColor:controlBackgroundColor, 
        opacity:0.8, 
        borderWidth:0,
        borderRadius:15 

      }}>
        <View style={{flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-evenly'}} >
          <MaterialIconButton 
            name="pencil-circle-outline"
            onPress={onClickToggleDrawMode}
          ></MaterialIconButton>
          <IoniconButton 
            name="arrow-undo-circle-outline"
            onPress={onClickUndo}
          ></IoniconButton>
          <MaterialIconButton
            name="delete-circle-outline"
            onPress={onClickClear}
          ></MaterialIconButton>
        </View>
        <View>
          {drawMode && (
            <View>
              <ColorPickerSmall
                color={strokeColor} 
                setColor={setStrokeColor}
              ></ColorPickerSmall>
            </View>
            // <View style={{flex:1, alignItems:'center'}}>
            //   <Text style={{fontSize:18}}>{strokeWidth}</Text>
            //   <View style={{flex: 1, flexDirection:'row', width:'100%', justifyContent:'space-around', alignItems:'flex-start'}}> 
            //     <IconButton
            //       onPress={()=>{
            //         setStrokeWidth(strokeWidth => strokeWidth-1 > 1 ? strokeWidth-1:1)
            //       }}
            //       name='minus-square'
            //       inColor='grey'
            //       outColor='black'
            //     >                
            //     </IconButton>
            //     <IconButton
            //       onPress={()=>{
            //         setStrokeWidth(strokeWidth => strokeWidth+1 < 100 ? strokeWidth+1:100 )
            //       }}
            //       name='plus-square'
            //       inColor='grey'
            //       outColor='black'
            //     >                
            //     </IconButton>
            //   </View> 
            // </View>

          )}
        </View>
      </View>
    </View>

  );
}
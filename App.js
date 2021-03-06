import { StatusBar } from 'expo-status-bar';
import React, {useRef, useState} from 'react';
import {reloadAsync} from "expo-updates";
import { StyleSheet, Text, Dimensions, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
// import { WebView } from 'react-native-webview';
import Svg,{Polyline, Path} from 'react-native-svg';
import GestureRecorderContainer from './GestureRecorderContainer';
import IconButton from './IconButton';
import ColorPicker from './ColorPicker';
import WebViewCommon from './WebViewCommon';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as d3 from 'd3'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navigationRef = createNavigationContainerRef();
const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
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
    top: 10,
    opacity: 1,
    zIndex: 9998,
    height: 'auto',
    padding: 10,
    width: 130
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

const Weather = ({navigation, route}) => {
  return <WebViewCommon
            source={{uri: 'https://www.weather.go.kr/wgis-nuri/html/map.html'}}
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
            // onError={onErrorWebView}
            // onLoad={onLoadWebView}
          >
          </WebViewCommon>
}

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
  const controlBackgroundColor = drawMode ? 'lightgrey':'transparent';
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

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true}></StatusBar>
      {/* {onErrorWebView === true && 
        <View>
          <IconButton
            onPress={()=>{
              reloadAsync();
            }}
            name='reload'
            inColor='grey'
            outColor='black'
          >                
          </IconButton>
        </View>
      
      } */}
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
            options={{
              tabBarStyle: {height:0},
            }} 
            component={Weather}   />
          <Tab.Screen 
            name="CCTV"        
            options={{
              tabBarStyle: {height:0},
            }} 
            component={CCTV}  
        />
        </Tab.Navigator>
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

      {drawMode && (
        <View style={{...styles.leftAbsolutePanel, backgroundColor:'transparent', opacity:1}}>
            <View style={{flex: 1}} >
            <TouchableOpacity
                style={{...styles.drawToggleBtn, backgroundColor:'lightgrey'}}
            >
                <Text style={{fontSize:18, color:'white'}}>Disabled</Text>
            </TouchableOpacity>
            </View>
        </View>
      )}


      <View style={{...styles.rightAbsolutePanel, backgroundColor:controlBackgroundColor, opacity:0.8, borderWidth:controlBorderWidth}}>
        <View style={{flex: 1}} >
          <TouchableOpacity
            style={{...styles.drawToggleBtn, backgroundColor:btnDrawModeColor}}
            onPress={onClickToggleDrawMode}
          >
            <Text style={{fontSize:18, color:btnDrawModeTextColor}}>Draw[{btnDrawModeText}]</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 7, backgroundColor:'transparent', marginTop:10}} >
          {drawMode && (
            <View style={{flex:1, alignItems:'center'}}>
              <Text style={{fontSize:18}}>{strokeWidth}</Text>
              <View style={{flex: 1, flexDirection:'row', width:'100%', justifyContent:'space-around', alignItems:'flex-start'}}> 
                <IconButton
                  onPress={()=>{
                    setStrokeWidth(strokeWidth => strokeWidth-1 > 1 ? strokeWidth-1:1)
                  }}
                  name='minus-square'
                  inColor='grey'
                  outColor='black'
                >                
                </IconButton>
                <IconButton
                  onPress={()=>{
                    setStrokeWidth(strokeWidth => strokeWidth+1 < 100 ? strokeWidth+1:100 )
                  }}
                  name='plus-square'
                  inColor='grey'
                  outColor='black'
                >                
                </IconButton>
              </View> 
              <ColorPicker color={strokeColor} setColor={setStrokeColor}></ColorPicker>
              <View style={{marginTop:50}}>
                <TouchableOpacity
                  style={{...styles.drawToggleBtn, alignItems:'center', justifyContent: 'center', height:50, width:100, backgroundColor:"darkred"}}
                  onPress={onClickUndo}
                >
                  <Text style={{fontSize:18, color:btnDrawModeTextColor}}>Undo</Text>
                </TouchableOpacity>
              </View>
              <View style={{marginTop:40}}>
                <TouchableOpacity
                  style={{...styles.drawToggleBtn, alignItems:'center', justifyContent: 'center', height:50, width:100, backgroundColor:"darkred"}}
                  onPress={onClickClear}
                >
                  <Text style={{fontSize:18, color:btnDrawModeTextColor}}>Clear</Text>
                </TouchableOpacity>
              </View>

            </View>

          )}
        </View>
      </View>
    </View>

  );
}
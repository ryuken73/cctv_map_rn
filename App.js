import { StatusBar } from 'expo-status-bar';
import React, {useRef, useState} from 'react';
import { StyleSheet, Text, Dimensions, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { WebView } from 'react-native-webview';
import Svg,{Polyline} from 'react-native-svg';
import GestureRecorderContainer from './GestureRecorderContainer';
import IconButton from './IconButton';
import { FontAwesome } from '@expo/vector-icons';

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

export default function App() {
  const [pathContainer, setPathContainer] = useState([[]]);
  const [pathIndex, setPathIndex] = React.useState(0);
  const [drawMode, setDrawMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(10);
  const btnDrawModeText = drawMode ? 'ON':'OFF';
  const btnDrawModeColor = drawMode ? 'darkslategrey':'transparent';
  const btnDrawModeTextColor = drawMode ? 'white':'black';
  const controlBorderWidth = drawMode ? 3:0;
  const { width, height } = Dimensions.get('window');

  const onClickToggleDrawMode = React.useCallback(() => {
    //initialize path array
    setPathIndex(0);
    setPathContainer([[]]);
    //toggle draw mode
    setDrawMode(drawMode => {
      return !drawMode;
    })
  },[drawMode])

  const toString = path => path.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true}></StatusBar>
      <WebView
        source={{uri: 'http://cctvmap.sbs.co.kr/map'}}
      >
      </WebView>
      {drawMode && (
        <View style={[styles.overlay, { height: "100%"}]} >
          <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
          {pathContainer.map((path, index) => (
            <Polyline
              key={index}
              points={toString(path)}
              fill="none"
              strokeOpacity={1}
              stroke={"black"}
              strokeWidth={strokeWidth}
            />
          ))}
          </Svg>    
          <GestureRecorderContainer 
            pathContainer={pathContainer} 
            setPathContainer={setPathContainer}
            pathIndex={pathIndex}
            setPathIndex={setPathIndex}
          >
          </GestureRecorderContainer>
        </View>
      )}

      <View style={{...styles.rightAbsolutePanel, borderWidth:controlBorderWidth}}>
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
            <View style={{flex: 1, flexDirection:'row', width:'100%', justifyContent:'space-evenly', alignItems:'flex-start'}}> 
              <IconButton
                onPress={()=>{
                  setStrokeWidth(strokeWidth => strokeWidth-1)
                }}
                name='minus-square'
                inColor='grey'
                outColor='black'
              >                
              </IconButton>
              <Text style={{fontSize:18}}>{strokeWidth}</Text>
              <IconButton
                onPress={()=>{
                  setStrokeWidth(strokeWidth => strokeWidth+1)
                }}
                name='plus-square'
                inColor='grey'
                outColor='black'
              >                
              </IconButton>
            </View> 
          )}
        </View>
      </View>
    </View>

  );
}
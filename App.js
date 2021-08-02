import { StatusBar } from 'expo-status-bar';
import React, {useRef, useState} from 'react';
import { SafeAreaView, StyleSheet, Text, Dimensions, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Svg,{Polyline} from 'react-native-svg';
import GestureRecorderContainer from './GestureRecorderContainer';

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
  overlayButton:{
    flex: 1,
    position: 'absolute',
    height: 80,
    right: 20,
    top: 10,
    opacity: 1,
    zIndex: 9999,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
  }
});

export default function App() {
  const [pathContainer, setPathContainer] = useState([[]]);
  const [pathIndex, setPathIndex] = React.useState(0);
  const [drawMode, setDrawMode] = useState(false);
  const btnDrawModeText = drawMode ? 'ON':'OFF';
  const btnDrawModeColor = drawMode ? 'red':'transparent';
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
              strokeWidth="10"
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
      <View style={{...styles.overlayButton, backgroundColor:btnDrawModeColor}} >
        <TouchableOpacity
          onPress={onClickToggleDrawMode}
        >
          <Text style={{fontSize:18}}>Draw[{btnDrawModeText}]</Text>
        </TouchableOpacity>
      </View>


    </View>

  );
}
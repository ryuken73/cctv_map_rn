import { StatusBar } from 'expo-status-bar';
import React, {useRef, useState} from 'react';
import { SafeAreaView, StyleSheet, Text, Dimensions, TouchableOpacity, View, PanResponder} from 'react-native';
import { WebView } from 'react-native-webview';
import Line from './Line';
import Svg,{Polyline} from 'react-native-svg';

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
    right: 20,
    top: 10,
    opacity: 1,
    zIndex: 9999,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
  }
});

const GestureRecorder = props => {
  const pathRef = useRef([]);
  const {path, onPathInit, onPathChanged, onPathReleased} = props;
  console.log('# re-render Recorder:', props)

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderGrant: () => {  
  //       onPathInit();
  //     },
  //     onPanResponderMove: (event) => {
  //       path.push({
  //         x: event.nativeEvent.locationX,
  //         y: event.nativeEvent.locationY,
  //       })
  //       // Uncomment the next line to draw the path as the user is performing the touch. (A new array must be created so setState recognises the change and re-renders the App)
  //       onPathChanged([...path]);
  //     },
  //     onPanResponderRelease: () => { 
  //         // onPathChanged([...path]);
  //         onPathReleased()
  //     }
  //   })
  // ).current;
  
  const panResponder =
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {  
        onPathInit();
      },
      onPanResponderMove: (event) => {
        path.push({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY,
        })
        // Uncomment the next line to draw the path as the user is performing the touch. (A new array must be created so setState recognises the change and re-renders the App)
        onPathChanged([...path]);
      },
      onPanResponderRelease: () => { 
          // onPathChanged([...path]);
          onPathReleased()
      }
    })
  
  return (
    <View
      style={StyleSheet.absoluteFill}
      {...panResponder.panHandlers}
    />
  );
}

const GestureRecorderContainer = props => {
  const {pathContainer, setPathContainer} = props;
  const {pathIndex, setPathIndex} = props;
  console.log('re-render recoder container:', props)
  React.useEffect(()=> {
    // initFirstPath
    // setPathIndex(0);
    // setPathContainer([[]]);
  },[]);

  const onPathInit = React.useCallback(() => {
    console.log('### initialized')
    // setPathContainer(pathContainer => [...pathContainer,[]])

  },[])

  const onPathChanged = React.useCallback(path => {
    setPathContainer(pathContainer => {
      return [...pathContainer.slice(0, pathIndex), path]
    });
  },[pathContainer, pathIndex])

  const onPathReleased = React.useCallback(() => {
    console.log('### released')
    setPathContainer(pathContainer => [...pathContainer,[]])
    setPathIndex(pathIndex => pathIndex + 1);
  },[])

  return (
    <GestureRecorder 
      path={pathContainer[pathIndex]}
      onPathInit={onPathInit}
      onPathChanged={onPathChanged}
      onPathReleased={onPathReleased}
    >
    </GestureRecorder>
  )
}

export default function App() {
  const [pathContainer, setPathContainer] = useState([[]]);
  const [pathIndex, setPathIndex] = React.useState(0);
  const [paths, setPaths] = useState([]);
  const [path, onPathChanged] = useState([]);
  const [drawMode, setDrawMode] = useState(false);
  const btnDrawModeText = drawMode ? 'ON':'OFF';
  const btnDrawModeColor = drawMode ? 'red':'transparent';
  const { width, height } = Dimensions.get('window');

  const onClickToggleDrawMode = React.useCallback(() => {
    setPaths([[]]);
    setPathIndex(0);
    setPathContainer([[]]);
    setDrawMode(drawMode => {
      return !drawMode;
    })
  },[drawMode])

  const updateLine = React.useCallback((pathIndex, path) => {
    setPaths(paths => {
      return [...paths.slice(0,pathIndex), path]
    })
  },[paths])

  const addLine = React.useCallback(() => {
    setPaths(paths => {
      return [...paths,[]];
    })
  },[paths]);

  const toString = path => path.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true}></StatusBar>
      <View style={{...styles.overlayButton, backgroundColor:btnDrawModeColor}} >
        <TouchableOpacity
          onPress={onClickToggleDrawMode}
        >
          <Text>Draw[{btnDrawModeText}]</Text>
        </TouchableOpacity>
      </View>
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
              strokeWidth="4"
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
        // <View style={[styles.overlay, { height: "100%"}]} >
        //   {/* <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}> */}
        //     {paths.map((path, index) => (
        //       <Line 
        //         key={index} 
        //         pathIndex={index}
        //         path={path} 
        //         updateLine={updateLine}
        //         addLine={addLine}
        //       ></Line>
        //     ))}
        //   {/* </Svg>     */}
        // </View>
      )}



      <WebView
        source={{uri: 'http://cctvmap.sbs.co.kr/map'}}
      >
      </WebView>

    </View>

  );
}
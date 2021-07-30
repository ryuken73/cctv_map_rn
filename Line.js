import React, {useRef, useState} from 'react';
import Svg, {Polyline} from 'react-native-svg';
import { StyleSheet, View, Dimensions, PanResponder } from 'react-native';

const examplePath = [
    { x: 90, y: 300 },
    { x: 170, y: 45 },
    { x: 250, y: 290 },
    { x: 45, y: 130 },
    { x: 285, y: 130 },
    { x: 90, y: 298 }
  ];

const GesturePath = ({ path, color }) => {
    console.log('111:',path)
    const { width, height } = Dimensions.get('window');
    const points = path.map(p => `${p.x},${p.y}`).join(' ');
    return (
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
        <Polyline
          points={points}
          fill="none"
          strokeOpacity={1}
          stroke={color}
          strokeWidth="4"
        />
      </Svg>    
    );
  };
  
  const GestureRecorder = ({ addLine, onPathChanged }) => {
    const pathRef = useRef([]);
  
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {  },
        onPanResponderMove: (event) => {
          pathRef.current.push({
            x: event.nativeEvent.locationX,
            y: event.nativeEvent.locationY,
          })
          // Uncomment the next line to draw the path as the user is performing the touch. (A new array must be created so setState recognises the change and re-renders the App)
          onPathChanged([...pathRef.current]);
        },
        onPanResponderRelease: () => { 
            onPathChanged([...pathRef.current]);
            addLine()
        }
      })
    ).current;
  
    return (
      <View
        style={StyleSheet.absoluteFill}
        {...panResponder.panHandlers}
      />
    );
  }

const Line = props => {
    const {
        path, 
        pathIndex,
        updateLine=()=>{},
        addLine=()=>{}
    } = props;

    const updatePath = React.useCallback(currentPath => {
        updateLine(pathIndex, currentPath)
    },[pathIndex, updateLine])

    return (
        <React.Fragment>
            <GestureRecorder addLine={addLine} onPathChanged={updatePath}/>  
            <GesturePath path={path} color="black"></GesturePath>
        </React.Fragment>
    )
}

export default  React.memo(Line);
import React from 'react'
import {StyleSheet, View, PanResponder} from 'react-native';

const GestureRecorder = props => {
    const {path, onPathInit, onPathChanged, onPathReleased} = props;
    // console.log('# re-render Recorder:', props)
  
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
          // Uncomment the next line to draw the path as the user is performing the touch. 
          // (A new array must be created so setState recognises the change and re-renders the App)
          onPathChanged([...path]);
        },
        onPanResponderRelease: () => { 
            onPathReleased()
        }
      })
    
    return (
      <View
        // in Android, panResponder View must have backgroundcolor, otherwise event will be triggered.
        style={{...StyleSheet.absoluteFill,backgroundColor:'rgba(255,255,255,0.01)'}}
        {...panResponder.panHandlers}
      />
    );
  }

export default React.memo(GestureRecorder);
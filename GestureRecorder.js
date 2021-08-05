import React from 'react'
import {StyleSheet, View, PanResponder, Platform} from 'react-native';

const FIRST_TOUCH = Platform.select({
  ios: 1,
  android: 0
})
const GestureRecorder = props => {
    const {path, onPathInit, onPathChanged, onPathReleased} = props;
    const panResponder =
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {  
          onPathInit();
        },
        onPanResponderMove: (event) => {
          const {identifier} = event.nativeEvent;
          console.log(event.nativeEvent)
          if(identifier === FIRST_TOUCH){
            path.push({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            })
          }
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
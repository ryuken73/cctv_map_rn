import React from 'react'
import {StyleSheet, View, PanResponder, Platform} from 'react-native';

const FIRST_TOUCH = Platform.select({
  ios: 1,
  android: 0
})

const moveTooSmall = (path, currentPosition, limit) => {
  const previousPosition = path[path.length - 1];
  if(previousPosition === undefined){
    return false;
  }
  const dx = currentPosition.x - previousPosition.x;
  const dy = currentPosition.y - previousPosition.y;
  return dx * dx + dy * dy < limit;

}
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
          // console.log(identifier)
          // track only single path (prevent making multi-path when multi-touched)
          const currentPosition = {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          }
          const MOVE_TOO_SMALL = moveTooSmall(path, currentPosition, 10);

          if(identifier === FIRST_TOUCH){
            if(MOVE_TOO_SMALL){
              path[path.length - 1] = currentPosition;
            } else {
              path.push(currentPosition);
            }
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
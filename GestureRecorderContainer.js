import React from 'react'
import GestureRecorder from './GestureRecorder';

const GestureRecorderContainer = props => {
    const {pathContainer, setPathContainer} = props;
    const {colorContainer, setColorContainer} = props;
    const {strokeColor} = props;
    const {pathIndex, setPathIndex} = props;
    // React.useEffect(() => {
    //   setColorContainer(colorContainer => {
    //     console.log(pathIndex, strokeColor, colorContainer)
    //     return [...colorContainer, strokeColor]
    //   })
    // },[strokeColor])
    const onPathInit = React.useCallback(() => {
      console.log('### initialized');
      setColorContainer(colorContainer => {
        console.log(pathIndex, strokeColor, colorContainer)
        return [...colorContainer, strokeColor]
      })
    },[strokeColor])
  
    const onPathChanged = React.useCallback(path => {
      setPathContainer(pathContainer => {
        return [...pathContainer.slice(0, pathIndex), path]
      });
    },[pathContainer, pathIndex])
  
    const onPathReleased = React.useCallback(() => {
      setPathContainer(pathContainer => [...pathContainer,[]])
      setPathIndex(pathIndex => pathIndex + 1);
    },[])
  
    return (
      <GestureRecorder 
        path={pathContainer[pathIndex]}
        onPathInit={onPathInit}
        onPathChanged={onPathChanged}
        onPathReleased={onPathReleased}
        // strokeColor={strokeColor}
        // setColorContainer={setColorContainer}
      >
      </GestureRecorder>
    )
  }

export default React.memo(GestureRecorderContainer);
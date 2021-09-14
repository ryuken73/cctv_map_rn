import React from 'react'
import GestureRecorder from './GestureRecorder';

const GestureRecorderContainer = props => {
    const {pathContainer, setPathContainer} = props;
    const {colorContainer, setColorContainer} = props;
    const {strokeColor} = props;
    const {pathIndex, setPathIndex} = props;
    const onPathInit = React.useCallback(() => {
      setColorContainer(colorContainer => {
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
      >
      </GestureRecorder>
    )
  }

export default React.memo(GestureRecorderContainer);
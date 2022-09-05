
import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

function MaterialIcon(props) {
    const {
        onPress,
        name='pencil-circle-outline',
        iconStyle={marginRight:0},
        size=24,
        color="white"
    } = props;
    const [timer, setTimer] = React.useState(null);
    return (
        <TouchableWithoutFeedback                   
            onPress={onPress}            
            onLongPress={()=>{
                const timer = setInterval(() => {
                    onPress()
                },500)
                setTimer(timer)
            }}
            delayLongPress={3000}
            onPressIn={()=>{}}
            onPressOut={()=>{
                setTimer(timer => {
                    clearInterval(timer);
                    return null
                })
            }}

        >
            <MaterialCommunityIcons
                size={size}
                iconStyle={iconStyle}
                name={name}
                color={color}
            ></MaterialCommunityIcons>   
        </TouchableWithoutFeedback>
    )
}

export default React.memo(MaterialIcon);
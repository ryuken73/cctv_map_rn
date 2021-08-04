import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

function IconButton(props) {
    const {
        onPress,
        name='minus-square',
        iconStyle={marginRight:0},
        size=24,
        inColor,
        outColor
    } = props;
    const [color, setColor] = React.useState(outColor);
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
            onPressIn={()=>{setColor(inColor)}}
            onPressOut={()=>{
                setColor(outColor);
                setTimer(timer => {
                    clearInterval(timer);
                    return null
                })
            }}

        >
            <FontAwesome
                size={size}
                iconStyle={iconStyle}
                name={name}
                color={color}
            ></FontAwesome>   
        </TouchableWithoutFeedback>
    )
}

export default React.memo(IconButton);
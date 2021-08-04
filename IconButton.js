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
    return (
        <TouchableWithoutFeedback                   
            onPress={onPress}
            onPressIn={()=>{setColor(inColor)}}
            onPressOut={()=>{setColor(outColor)}
        }>
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
import React from 'react'
import ColorPalette from 'react-native-color-palette'
import { FontAwesome } from '@expo/vector-icons';
     
const ControlledColorPicker = props => {
    const {color='#000000', setColor=()=>{}} = props;
    return (
        <ColorPalette
            onChange={setColor}
            title={''}
            value={color}
            colors={['#000000', '#ff0000', '#ccff33', '#0000cc']}
            // scaleToWindow={true}
            paletteStyles={{}}
            icon={
            <FontAwesome name={'check-circle-o'} size={15} color={'white'} />
        }
        />
    )
}

export default React.memo(ControlledColorPicker)

import React from 'react';
import {WebView} from 'react-native-webview';

const WebViewCommon = props => {
    const {source} = props;
    return (
        <>
            <WebView
                source={source}
                scalesPageToFit={false}
            >
            </WebView>
        </>
    )
}

export default React.memo(WebViewCommon)



import * as React from 'react';
import { DefaultTheme } from 'react-native-paper';

const timeFormat = (value) => {
    const time = value.seconds ? new Date(value.seconds * 1000) : value;
    
    let hourFormat = '0'+time.getHours();
    let hourNum = hourFormat.substr(-2);

    let minutesFormat = '0'+time.getMinutes();
    let minutesNum = minutesFormat.substr(-2);

    const result = hourNum+':'+minutesNum;
    return result;
}

export default timeFormat;


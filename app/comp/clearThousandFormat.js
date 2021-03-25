import * as React from 'react';
import { DefaultTheme } from 'react-native-paper';

const clearThousandFormat = (value) => {
    const result = value != '' ? parseInt(value.toString().replace(/,/g, '')) : 0;
    return result;
}

export default clearThousandFormat;


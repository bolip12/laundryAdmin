import * as React from 'react';
import { DefaultTheme } from 'react-native-paper';
import dateFormat from './dateFormat.js';

const dateFilterFormat = (value) => {

	let result = '';
	if(value) {
	    result = new Date(dateFormat(value)+' '+'00:00:00 GMT+07:00');
	}
    return result;
}

export default dateFilterFormat;


import * as React from 'react';
import { DefaultTheme } from 'react-native-paper';

const dateFormat = (value) => {

	let result = '';
	if(value) {
		const date = value.seconds ? new Date(value.seconds * 1000) : value;

	    //date
	    const dateFormat = '0'+date.getDate();
	    const dateNum = dateFormat.substr(-2);

	    //month
	    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	    result = dateNum+' '+monthNames[date.getMonth()]+' '+date.getFullYear();
	}
    return result;
}

export default dateFormat;


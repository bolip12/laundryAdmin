import * as React from 'react';
import { DefaultTheme } from 'react-native-paper';

const dateFormatBayar = (value) => {

	let result = '';
	if(value) {
		const date = value ? new Date(value) : value;

	    //date
	    const dateFormat = '0'+date.getDate();
	    const dateNum = dateFormat.substr(-2);

	    const monthFormat = '0'+(date.getMonth()+1);
	    const monthNum = monthFormat.substr(-2);
	    
	    //month
	    //const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	    result = date.getFullYear()+'-'+monthNum+'-'+dateNum;
	}
    return result;
}

export default dateFormatBayar;


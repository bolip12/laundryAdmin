import * as React from 'react';

const dateTimeFormatSupa = (value) => {
	let result = '';
	if(value) {
	    //date
	    const dateNum = value.substr(8, 2);

	    //month
	    const monthNum = value.substr(5, 2) - 1;
	    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agy", "Sep", "Okt", "Nov", "Des"];

	    //year
	    const yearNum = value.substr(0, 4);

	    /*//hour
	    const hourNum = value.substr(11, 5);*/

	    result = dateNum+' '+monthNames[monthNum]+' '+yearNum/*+' '+hourNum*/;
	}
    return result;
}

export default dateTimeFormatSupa;

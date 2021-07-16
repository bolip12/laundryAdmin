import * as React from 'react';

const dateFormatSupa = (value) => {
	let result = '';
	if(value) {
	    //date
	    const dateNum = value.substr(-2);

	    //month
	    const monthNum = value.substr(5, 2) - 1;
	    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agy", "Sep", "Okt", "Nov", "Des"];

	    //year
	    const yearNum = value.substr(0, 4);

	    result = dateNum+' '+monthNames[monthNum]+' '+yearNum;
	}
    return result;
}

export default dateFormatSupa;


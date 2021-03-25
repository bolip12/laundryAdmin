import * as React from 'react';

const checkRangeDate = (StartDate, EndDate, Range) => {
	let Diff = Math.round((EndDate.getTime() - StartDate.getTime()) / 86400000);

	if(Diff < 0) {
		alert('End Date harus lebih kecil dari Start Date');
		return false;
    } else if(Diff > Range) {
    	alert('Rentang tanggal max '+Range+' hari');
    	return false;
    } else {
    	return true;
    }
}

export default checkRangeDate;
import * as React from 'react';

const getListUid = (uid, pid) => {
	let listUid = [];
	listUid.push(uid);

	if(pid != '-') {
		listUid.push(pid);
	}
    
  return listUid;
}

export default getListUid;
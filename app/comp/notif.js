import * as React from 'react';
import { Snackbar } from 'react-native-paper';
import store from '../config/storeApp';

class notif extends React.Component {

	constructor(props) {
	    super(props);

	    //redux variable
	    this.state = store.getState();  
	    store.subscribe(()=>{
	      this.setState(store.getState());
	    });

	    this.state = {
	      ...this.state,
	    };

	}

	onHideNotif() {
	    store.dispatch({
	      type: "NOTIF",
	      payload: { notifDisplay:false, notifMessage:"" }
	    });
	}

	render() {
		return (
			<Snackbar
				visible={this.state.notifDisplay}
				onDismiss={() => this.onHideNotif()}
				duration={1000}
				style={{ backgroundColor: this.state.notifType == 'error' ? 'red' : 'black' }}
			>
				{this.state.notifMessage}
			</Snackbar>
		);
	}
}

export default notif;
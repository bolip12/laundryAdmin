import * as React from 'react';
import { Snackbar } from 'react-native-paper';


class notif extends React.Component {

	constructor(props) {
	    super(props);

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
import * as React from 'react';
import { Platform, ScrollView, View, Dimensions } from 'react-native';
import { Portal, Dialog, Button } from 'react-native-paper';

import theme from '../config/theme.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class formBottom extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	dialogDisplay: false,
	    };
	}

	toggleDisplay() {
	    this.props.onToggleForm();
	}

	render() {
		return (
			<View>
				<Portal>
		          <Dialog
		            visible={this.props.display} 
		            onDismiss={() => this.toggleDisplay()}
		            style={Platform.OS == 'android' ? { position:'absolute', bottom:0, width:windowWidth, marginVertical:0, marginHorizontal:0 } : {top:-50, marginHorizontal:5} }
		          >
		            <Dialog.Title>{this.props.title}</Dialog.Title>
	            	<Dialog.ScrollArea style={{ maxHeight:(windowHeight*0.5)}}>
			            <ScrollView keyboardShouldPersistTaps="handled">
			            {this.props.children}
			            </ScrollView>
		            </Dialog.ScrollArea>

		            <Dialog.Actions style={{ justifyContent:'flex-end' }}>
		              <Button icon="cancel" style={{ paddingRight:5 }} onPress={() => this.toggleDisplay()}>CLOSE</Button>
		            </Dialog.Actions>
		          </Dialog>
		        </Portal>
		    </View>
		);
	}
}

export default formBottom;
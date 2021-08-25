import * as React from 'react';
import { Platform, ScrollView, View, Dimensions } from 'react-native';
import { Title, Divider, Button, IconButton } from 'react-native-paper';
import RBSheet from "react-native-raw-bottom-sheet";

import theme from '../config/theme.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class formBottomSheet extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    };
	}

	componentDidUpdate(prevProps, prevState) {
	    if(prevProps.display !== this.props.display && this.props.display == true) {
	      this.RBSheet.open();
	    }

	    if(prevProps.display !== this.props.display && this.props.display == false) {
	      this.RBSheet.close();
	    }
	}

	toggleDisplay() {
	    this.props.onToggleForm();
	}

	render() {
		return (
			<RBSheet
	          ref={ref => {
	            this.RBSheet = ref;
	          }}
	          openDuration={250}
	          closeOnPressMask={false}
	          customStyles={{ container:{height:'auto', maxHeight:(windowHeight*0.5)} }}
	        >
	        	<ScrollView keyboardShouldPersistTaps="handled" style={{margin:10}}>
	        		<View style={{flexDirection:'row'}}>
		        		<Title style={{marginLeft:20}}>{this.props.title}</Title>

		        		<View style={{marginLeft: 'auto'}}>
						<Button 
					    	mode="text"
					    	icon="cancel"
					    	color="grey"
					    	onPress={() => this.toggleDisplay()}
					    >
						    Close
						</Button>
						{/*<IconButton
						    icon="close-thick"
						    color="grey"
						    onPress={() => this.toggleDisplay()}
						    style={{ }}
						/>*/}
						</View>
					</View>
		        	<Divider />
		        	

		        	<View style={{marginVertical:10}}>
		            {this.props.children}
		            </View>
				</ScrollView>

	        </RBSheet>
		);
	}
}

export default formBottomSheet;
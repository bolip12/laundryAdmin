import * as React from 'react';
import { ScrollView, View, FlatList, Dimensions } from 'react-native';
import { HelperText, List, Portal, Dialog, RadioButton, Button } from 'react-native-paper';

import theme from '../config/theme.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class pickerInput extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	pickerDisplay: false,
	    	labelSelected: '',
	    };
	}

	toggleDisplay() {
	    this.setState({pickerDisplay: !this.state.pickerDisplay})
	}

	componentDidMount() {
		this.defaultValue();
	}

	componentDidUpdate(prevProps, prevState) {
	    if(prevProps.value !== this.props.value) {
	      this.defaultValue();
	    }
	}

	defaultValue() {
		//this.defaultValue();
		let labelSelected = this.props.label;
		let valueSelected = this.props.value;

		this.setState({labelSelected:labelSelected, valueSelected:valueSelected});
	}

	onSelect(value) {
	    this.props.onChangePickerValue(value);

	    let label = '';
	    this.props.options.map((item, key) => {
	    	if(item.value == value) {
	    		label = item.label;
	    	}
	    });

	    this.setState({labelSelected: label})
	    this.props.onChangePickerLabel(label);
	    this.toggleDisplay();
	}

	render() {
		return (
			<View>
				<HelperText style={{ color:theme.colors.primary, marginHorizontal:10, marginBottom:-20 }}>{this.props.title}</HelperText>
	            <List.Item
	              title={this.state.labelSelected}
	              right={() => <List.Icon icon="menu-down" />}
	              onPress={() => this.toggleDisplay()}
	              style={{ height:60, marginHorizontal:10, borderBottomColor:'#cccccc', borderBottomWidth:1 }}
	            />

				<Portal>
		          <Dialog
		            visible={this.state.pickerDisplay} 
		            onDismiss={() => this.toggleDisplay()}
		            style={{ position:'absolute', bottom:0, width:windowWidth, marginVertical:0, marginHorizontal:0 }}
		          >
		            <Dialog.Title>{this.props.title} :</Dialog.Title>
		            <Dialog.ScrollArea style={{ height:(windowHeight*0.3) }}>
		              <RadioButton.Group onValueChange={(value) => this.onSelect(value)} value={this.state.valueSelected}>
		                <FlatList
		                  data={this.props.options}
		                  keyExtractor={(item) => item.label}
		                  style={{ backgroundColor:'#fff' }}
		                  renderItem={({ item }) => (
		                    <RadioButton.Item value={item.value} label={item.label} color={theme.colors.primary} />
		                  )}
		                />
		              </RadioButton.Group>
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

export default pickerInput;
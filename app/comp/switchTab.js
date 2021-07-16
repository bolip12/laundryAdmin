import * as React from 'react';

import theme from '../config/theme.js';
import SwitchSelector from "react-native-switch-selector";

class switchTab extends React.Component {

	constructor(props) {
	    super(props);
	}

	onChangeValue(value) {
		this.props.onChange(value);
	}

	render() {
		return (
			<SwitchSelector
	          initial={this.props.initial ? this.props.initial : 0}
	          onPress={value => this.onChangeValue(value)}
	          buttonColor='white'
	          textColor='gray'
	          selectedColor={theme.colors.primary}
	          textContainerStyle={{padding:15}}
	          selectedTextContainerStyle={{borderBottomColor:theme.colors.primary,borderBottomWidth:2,padding:15}}
	          borderRadius={5}
	          buttonMargin={5}
	          options={this.props.options}
	        />
		);
	}
}

export default switchTab;
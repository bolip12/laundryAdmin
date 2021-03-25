import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import theme from '../config/theme.js';
import dateFormat from './dateFormat.js';
import timeFormat from './timeFormat.js';

class dateTimeInput extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	display: false,
	    };

	}
	componentDidMount() {
		let minDate = new Date();
		minDate.setDate(minDate.getDate() - 60);

		this.setState({minDate:minDate});
	}

	onSelect(date) {
		this.setState({display:false});
		if(date) {
			this.props.onChangeDate(date);
		}
	}

	render() {
		const valueSelected = this.props.mode == 'date' ? dateFormat(this.props.value) : timeFormat(this.props.value);
		const styleProps = typeof this.props.style != 'undefined' ? this.props.style : '';

		return (
			<View>
				<HelperText style={{marginTop:5, marginBottom:-20, marginLeft:10, color:theme.colors.primary}}>{this.props.title}</HelperText>
				<List.Item
				    title={valueSelected}
				    right={() => <List.Icon icon="calendar" />}
				    onPress={() => this.setState({display:true})}
				    style={[styles.list, styleProps]}
				/>

				{this.state.display && (
		        <DateTimePicker
					value={this.props.value}
					mode={this.props.mode}
					is24Hour={true}
					display="calendar"
					onChange={(event,date) => this.onSelect(date)}
					timeZoneOffsetInMinutes={420}
					minimumDate={this.state.minDate}
					maximumDate={new Date()}
		        />
		        )}
	        </View>
		);
	}
}

const styles = StyleSheet.create({
  list: {
   	marginHorizontal:5,
	height:50,
	marginBottom:5
  },
})



export default dateTimeInput;
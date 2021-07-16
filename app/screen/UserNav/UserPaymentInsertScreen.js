import * as React from 'react';
import { ScrollView, View, FlatList, Alert, Text } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button, HelperText, Divider } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';

import firebase from '../../config/firebase.js';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import store from '../../config/storeApp';

import DateTimeInput from '../../comp/dateTimeInput.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import dateFormat from '../../comp/dateFormat.js';
import clearThousandFormat from '../../comp/clearThousandFormat.js';
import thousandFormat from '../../comp/thousandFormat.js';

class UserPaymentInsertScreen extends ValidationComponent {

	constructor(props) {
	    super(props);

	    this.state = store.getState();  
	    store.subscribe(()=>{
	      this.setState(store.getState());
	    });

	    this.state = {
	    	...this.state,

	    	nominal: '',
	    	tanggal: new Date(),

	    };
	}


	async onSubmit() {
		this.validate({
			tanggal: {required:true},
			nominal: {required:true},
		});


		if(this.isFormValid()) {
			store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:true }
	        });

			let userId = this.props.route.params.userId;
			let namaUsaha = this.props.route.params.namaUsaha;
			let licenseDate = new Date(this.props.route.params.licenseDate.seconds * 1000);
			licenseDate.setMonth(licenseDate.getMonth() + 6);

			const dataInsert = { uid: userId, 
								 nama: namaUsaha,
								 tanggal: this.state.tanggal, 
								 nominal: clearThousandFormat(this.state.nominal),
								 licenseDate: licenseDate,
								};
			await firebase.firestore().collection('userPayment').doc().set(dataInsert);

			store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:false }
	        });

	        showMessage({
	          message: 'Data berhasil disimpan',
	          icon: 'success',
	          backgroundColor: theme.colors.primary,
	          color: theme.colors.background,
	        }); 

	        this.props.navigation.navigate('UserPaymentScreen');
		}
	}

	render() {
	    return (
	    	<PaperProvider theme={theme}>
			    <Appbar.Header style={styleApp.Appbar}>
			      <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
			      <Appbar.Content title="User Payment Insert" color= {theme.colors.primary}/>
			    </Appbar.Header>

			    <ScrollView style={styleApp.ScrollView}>
			  		
			  		<DateTimeInput
						title="Tanggal"
						value={this.state.tanggal}
			         	mode="date"
			         	onChangeDate={(date) => this.setState({tanggal:date})}
				         	
					/>
					<Divider/>
				    {this.isFieldInError('tanggal') && this.getErrorsInField('tanggal').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }


				    <TextInput
					    label="Nominal"
					    value={thousandFormat(this.state.nominal)}
					    keyboardType={'numeric'}
					    onChangeText={text => this.setState({nominal: text})}
					    style={styleApp.TextInput}																														
				    />
				    {this.isFieldInError('nominal') && this.getErrorsInField('nominal').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

				    
			    </ScrollView>

			    <Button 
			    	mode="contained"
			    	icon="content-save-outline" 
			    	onPress={() => this.onSubmit()}
			    	disabled={this.state.isLoading}
			    	style={styleApp.Button}
			    >
				    Save
				</Button>


			</PaperProvider>
	    )
	}
}

export default UserPaymentInsertScreen;
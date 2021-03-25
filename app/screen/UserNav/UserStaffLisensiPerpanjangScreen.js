import * as React from 'react';
import { ScrollView, View, FlatList, Alert, Text } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button, HelperText, Divider } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';

import firebase from '../../config/firebase.js';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import store from '../../config/storeApp';

import PickerInput from '../../comp/pickerInput.js';
import FormBottom from '../../comp/formBottom.js';
import FormBottomRadio from '../../comp/formBottom.js';
import FormBottomBayar from '../../comp/formBottom.js';
import thousandFormat from '../../comp/thousandFormat.js';
import clearThousandFormat from '../../comp/clearThousandFormat.js';
import dateFormat from '../../comp/dateFormat.js';
import dateFormatShort from '../../comp/dateFormatShort.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import DateTimeInputLicense from '../../comp/dateTimeInputLicense.js';

class UserStaffLisensiPerpanjangScreen extends ValidationComponent {

	constructor(props) {
	    super(props);

	    this.state = store.getState();  
	    store.subscribe(()=>{
	      this.setState(store.getState());
	    });

	    this.state = {
	    	...this.state,

	    	//nominal: 180000,
	    	/*tanggalMulai: new Date(),
	    	tanggalAkhir: new Date(),*/

	    };
	}

	componentDidMount() {
		this.fetchData();

		let nominal = 180000 + this.getRandomInt();
		this.setState({nominal: nominal});
	}

	async fetchData() {
	    //data
	    let self = this;

	    let staffId = this.props.route.params.staffId;

	    //query
	    let tanggalMulai = '';
	    let tanggalAkhir= '';

	    let query = firebase.firestore().collection('userLicense').where('userId', '==', staffId).orderBy('tanggalMulai', 'desc').limit(1)
	    const docList = await query.get();
		docList.forEach(doc => {
		  const docData = doc.data();
		  namaUsaha = docData.namaUsaha;
		  nama = docData.nama;
		  
		  tanggalMulai = new Date(docData.tanggalAkhir.seconds * 1000);
		  tanggalMulai.setDate(tanggalMulai.getDate() + 1);

		  tanggalAkhir = new Date(docData.tanggalAkhir.seconds * 1000);
		  tanggalAkhir.setMonth(tanggalAkhir.getMonth() + 6);
		  
		});
		
		//result
		this.setState({tanggalMulai:tanggalMulai, tanggalAkhir:tanggalAkhir, nama:nama, namaUsaha:namaUsaha});
	}


	async onSubmit() {
		this.validate({
			tanggalMulai: {required:true},
			tanggalAkhir: {required:true},
			nominal: {required:true},
		});


		if(this.isFormValid()) {
			store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:true }
	        });

			let docId = this.props.route.params.docId;

			const dataInsert = { 
								 userId: docId,
								 namaUsaha: this.state.namaUsaha,
								 nama: this.state.nama,
								 tanggalMulai: this.state.tanggalMulai, 
								 tanggalAkhir: this.state.tanggalAkhir, 
								 nominal: clearThousandFormat(this.state.nominal),
								 statusBayar: 'belumBayar',
								 statusLicense: 'belumDisetujui'
								};
			await firebase.firestore().collection('userLicense').doc().set(dataInsert);

			store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:false }
	        });

	         store.dispatch({
	            type: 'NOTIF',
	            payload: { notifDisplay:true, notifMessage:'Data berhasil disimpan' }
	        });

	        this.props.navigation.navigate('StafLisensiScreen');
		}
	}

	getRandomInt(max=100) {
	  return Math.floor(Math.random() * Math.floor(max));
	}

	render() {
	    return (
	    	<PaperProvider theme={theme}>
			    <Appbar.Header style={styleApp.Appbar}>
			      <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
			      <Appbar.Content title="Pepanjangan Lisensi" color= {theme.colors.primary}/>
			    </Appbar.Header>

			    <ScrollView style={styleApp.ScrollView}>
			  		
			  		<TextInput
						label="Tanggal Mulai"
						value={dateFormat(this.state.tanggalMulai)}
			         	disabled
			         	onChangeDate={(date) => this.setState({tanggalMulai:date})}
				        style={styleApp.TextInput}	
					/>
					<Divider/>
				    
				    <TextInput
						label="Tanggal Akhir"
						value={dateFormat(this.state.tanggalAkhir)}
			         	disabled
			         	onChangeDate={(date) => this.setState({tanggalAkhir:date})}
				        style={styleApp.TextInput}	
					/>
					<Divider/>
				    
				    <TextInput
					    label="Nominal"
					    value={thousandFormat(this.state.nominal)}
					    disabled
					    onChangeText={text => this.setState({nominal: text})}
					    style={styleApp.TextInput}																														
				    />
				    <Divider/>
				    
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

export default UserStaffLisensiPerpanjangScreen;
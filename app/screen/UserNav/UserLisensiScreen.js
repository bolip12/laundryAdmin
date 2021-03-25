import * as React from 'react';
import { View, FlatList, Alert, Text, ScrollView } from 'react-native';
import { Provider as PaperProvider, Appbar, Searchbar, List, Divider, Chip, Portal, Caption, Subheading, Dialog, TextInput, Button, IconButton, Badge, RadioButton } from 'react-native-paper';
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

class UserLisensiScreen extends ValidationComponent {
	constructor(props) {
	    super(props);

	    this.state = store.getState();  
	    store.subscribe(()=>{
	      this.setState(store.getState());
	    });

	    this.state = {
	    	...this.state,
	    	dataList: [],
	    	bankData: [],

	    	formDisplay: false,
	    	radioChecked: '',
	    	docId: '',
	    	
	    };

	    this.db = firebase.firestore().collection('database').doc(this.state.dbid);
	}

	componentDidUpdate(prevProps, prevState) {
	    if(prevState.notifDisplay !== this.state.notifDisplay) {
	      this.fetchData();
	    }
	}


	componentDidMount() {
		this.fetchData();
		this.fetchDataBank();
	}

	async fetchData() {
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

        let userId = this.props.route.params.userId;

		//query
		let query = firebase.firestore().collection('userLicense').where('userId', '==', userId).orderBy('tanggalMulai');

	    //data
	    const dataList = [];

	    const docList = await query.get();
		docList.forEach(doc => {
		  const docData = doc.data();
		  dataList.push({
		  	id : doc.id,
		  	nama: docData.nama,
		  	tanggalMulai: docData.tanggalMulai,
		  	tanggalAkhir: docData.tanggalAkhir,
		  	nominal: docData.nominal,
		  	statusBayar: docData.statusBayar,
		  	statusLicense: docData.statusLicense,
		  });
		});

		//result
		this.setState({dataList:dataList});
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
        });
		
	}

	async fetchDataBank() {

		let query = firebase.firestore().collection('referensi').doc('bank').collection('bank');

	    //data
	    const bankData = [];

	    const docList = await query.get();
		docList.forEach(doc => {
		  const docData = doc.data();
		  bankData.push({
		  	id: doc.id,
            nama : docData.nama,
            rekening : docData.rekening,
		  });
		});
		

	    this.setState({ bankData: bankData });
	   	
	}

	async onSubmit() {

		if(this.isFormValid()) {
			store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:true }
	        });

			const dataUpdate = { 
								 statusBayar: 'sudahBayar',
								 bank: this.state.radioChecked,
								};

			await firebase.firestore().collection('userLicense').doc(this.state.docId).update(dataUpdate);

			store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:false }
	        });

	         store.dispatch({
	            type: 'NOTIF',
	            payload: { notifDisplay:true, notifMessage:'Data berhasil disimpan' }
	        });

	        this.toggleForm();
			
		}
	}

	toggleForm(docId) {
	    this.setState({formDisplay: !this.state.formDisplay});
	    this.setState({docId:docId});
	    
	}


	onDesc(item) {
		return(
			<View>
				<Caption style={{ fontSize: 14 }}>Tanggal Mulai: {dateFormat(item.tanggalMulai)}</Caption>
				<Caption style={{ fontSize: 14 }}>Tanggal Akhir: {dateFormat(item.tanggalAkhir)}</Caption>
			</View>
		);
	}
	
	onRight(item) {
		let valueStatusBayar = '';
		if(item.statusBayar == 'sudahBayar') {
			valueStatusBayar = 'Sudah Bayar';
		}

	    return(
	      <View>
	        <Subheading style={styleApp.Subheading}>{thousandFormat(item.nominal)}</Subheading>
	        { item.statusBayar == 'belumBayar' &&
 		  	<Button 
              onPress={() => this.toggleForm(item.id)}
              mode="contained" 
              style={{ height: 35 ,justifyContent: 'center', marginTop:10 }}
            > 
              Bayar 
            </Button>
            }

            { item.statusBayar == 'sudahBayar' &&
            <Chip mode="outlined" style={{ borderRadius: 3, height:37, marginTop:5, borderColor: 'green', justifyContent: "center", alignItems: "center"}} textStyle={{fontSize:13, color:'green'}}>{valueStatusBayar}</Chip>
        	}
	      </View>
	    );
	}

	

	render() {
	    return (
	    	<PaperProvider theme={theme}>
			    <Appbar.Header style={styleApp.Appbar}>
			      <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
			      <Appbar.Content title="User Lisensi" color= {theme.colors.primary}/>
			    </Appbar.Header>
			    
			    <FlatList
			      keyboardShouldPersistTaps="handled"
                  data={this.state.dataList}
                  keyExtractor={(item) => item.id}
                  style={styleApp.FlatList}
                  renderItem={({ item }) => (
                    <View>
                    	<List.Item
			              title={item.nama}
			              description={() => this.onDesc(item)}
			              right={() => this.onRight(item)}
			              //onPress={() => this.onSelect(item.id)}
			            />
			            <Divider />
                    </View>
                  )}
                />

                <Button 
		            mode="contained"
		            icon="plus" 
		            onPress={() => this.props.navigation.navigate('UserLisensiPerpanjangScreen', {userId:this.props.route.params.userId})}
		            disabled={this.state.isLoading}
		            style={styleApp.Button}
		         >
		            Perpanjang
		        </Button>

		        <FormBottom
		        	title="Pilih Bank"
		        	display={this.state.formDisplay}
		        	onToggleForm={status => this.toggleForm()}
		        >
		        
		            <RadioButton.Group onValueChange={(value) => this.setState({radioChecked:value})} value={this.state.radioChecked} >
		            <FlatList
		              data={this.state.bankData}
		              keyExtractor={(item) => item.id}
		              style={{ backgroundColor:'#fff' }}
		              renderItem={({ item }) => (
		                <RadioButton.Item label={item.nama+'\nRek: '+item.rekening} value={item.nama} />
		              )}
		            />
		            </RadioButton.Group>


				    <Button 
				    	mode="contained"
				    	icon="content-save-outline" 
				    	onPress={() => this.onSubmit()}
				    	disabled={this.state.isLoading}
				    	style={styleApp.Button}
				    >
					    Save
					</Button>

					
		        </FormBottom>

			</PaperProvider>
	    )
	}
}

export default UserLisensiScreen;
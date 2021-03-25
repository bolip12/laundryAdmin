import * as React from 'react';
import { View, FlatList, Alert, Text, ScrollView } from 'react-native';
import { Provider as PaperProvider, Appbar, Searchbar, List, Divider, Chip, Portal, Caption, Subheading, Dialog, TextInput, Button, IconButton, Badge, RadioButton } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';

import firebase from '../../config/firebase.js';
import theme from '../../config/theme.js';
import store from '../../config/storeApp';
import styleApp from '../../config/styleApp.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import dateFormat from '../../comp/dateFormat.js';
import DateTimeInput from '../../comp/dateTimeInput.js';
import thousandFormat from '../../comp/thousandFormat.js';
import clearThousandFormat from '../../comp/clearThousandFormat.js';

class PaymentScreen extends ValidationComponent {
	constructor(props) {
	    super(props);

	    this.state = store.getState();  
	    store.subscribe(()=>{
	      this.setState(store.getState());
	    });

	    this.state = {
	    	...this.state,
	    	dataList: [],
	    	
	    	docId: '',

	    };
	}

	componentDidUpdate(prevProps, prevState) {
	    if(prevState.notifDisplay !== this.state.notifDisplay) {
	      this.fetchData();
	    }
	}


	componentDidMount() {
		this.fetchData();
	}

	async fetchData() {
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

		//query
		let query = firebase.firestore().collection('userLicense').where('statusLicense', '==', 'belumDisetujui').orderBy('tanggalMulai');

	    //data
	    const dataList = [];
	    
	    const docList = await query.get();
		docList.forEach(doc => {
		  const docData = doc.data();
		  dataList.push({
		  	id : doc.id,
		  	userId: docData.userId,
		  	nama: docData.nama,
		  	namaUsaha: docData.namaUsaha,
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

	async onSubmit(docId, userId, tanggalAkhir) {

		if(this.isFormValid()) {
			store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:true }
	        });

			let self = this;
			let batch = firebase.firestore().batch();

			const dataUpdate = { 
								 statusLicense: 'sudahDisetujui',
								 
								};

			let docUpdate = firebase.firestore().collection('userLicense').doc(docId);
			batch.update(docUpdate, dataUpdate);

			const dataUpdateUser = { 
								 licenseDate: new Date(tanggalAkhir.seconds * 1000),
								 
								};
			
			let docUpdateUser = firebase.firestore().collection('user').doc(userId);
			batch.update(docUpdateUser, dataUpdateUser);
			
			await batch.commit().then(function () {
				store.dispatch({
		            type: 'LOADING',
		            payload: { isLoading:false }
		        });

		         store.dispatch({
		            type: 'NOTIF',
		            payload: { notifDisplay:true, notifMessage:'Data berhasil disimpan' }
		        });

		    	self.fetchData();
			});
		}
	}

	onApproveConfirm(docId, userId, tanggalAkhir) {
		
	    Alert.alert(
	      "Warning",
	      "Apakah anda yakin?",
	      [
	        { text: "Cancel" },
	        { text: "OK", onPress: () => this.onSubmit(docId, userId, tanggalAkhir) }
	      ],
	    );
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
	        
 		  	<Button 
              onPress={() => this.onApproveConfirm(item.id, item.userId, item.tanggalAkhir)}
              mode="contained" 
              style={{ height: 35 ,justifyContent: 'center', marginTop:10 }}
            > 
              Approve 
            </Button>
            
	      </View>
	    );
	}

	render() {
	    return (
	    	<PaperProvider theme={theme}>
			    <Appbar.Header style={styleApp.Appbar}>
			      <Appbar.Content title="Payment" color= {theme.colors.primary}/>
			    </Appbar.Header>
			    
			    <FlatList
			      keyboardShouldPersistTaps="handled"
                  data={this.state.dataList}
                  keyExtractor={(item) => item.id}
                  style={styleApp.FlatList}
                  renderItem={({ item }) => (
                    <View>
                    	<List.Item
			              title={item.nama+' '+'('+item.namaUsaha+')'}
			              description={() => this.onDesc(item)}
			              right={() => this.onRight(item)}
			              //onPress={() => this.onSelect(item.id)}
			            />
			            <Divider />
                    </View>
                  )}
                />

			</PaperProvider>
	    )
	}
}

export default PaymentScreen;
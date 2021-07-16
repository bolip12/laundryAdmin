import * as React from 'react';
import { View, FlatList, Alert, Text, ScrollView } from 'react-native';
import { Provider as PaperProvider, Appbar, Searchbar, List, Divider, Chip, Portal, Caption, Subheading, Dialog, TextInput, Button, IconButton, Badge, RadioButton } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';
import { showMessage } from "react-native-flash-message";

import supabase from '../../config/supabase.js';
import theme from '../../config/theme.js';
import store from '../../config/storeApp';
import styleApp from '../../config/styleApp.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import dateFormat from '../../comp/dateFormat.js';
import dateFormatSupa from '../../comp/dateFormatSupa.js';
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
	   /* if(prevState.notifDisplay !== this.state.notifDisplay) {
	      this.fetchData();
	    }*/
	}


	componentDidMount() {
		this.fetchData();
		//this.fetchDataUser();
	}

	async fetchData() {
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });


        let { data, error } = await supabase
		      .from('user_license')
		      .select('id, user_id, user:user_id ( nama, nama_usaha, telepon ), tanggal_mulai, tanggal_akhir, nominal, status_license, status_bayar')
		      .eq('status_license', 'not_approved')
		      .order('tanggal_mulai', {ascending:false})

		//result
		this.setState({dataList:data});
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
        });
		
	}
	

	async onSubmit(docId, userId, tanggalAkhir, telepon) {
	
		if(this.isFormValid()) {
			store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:true }
	        });

			let message = 'KotakBon: Lisensi aplikasi berhasil diperpanjang sampai Tanggal '+dateFormatSupa(tanggalAkhir);
			
			let update_license = await supabase
							  .from('user_license')
							  .update([{
								    	status_license: 'approved',
								 		
									}])
							  .eq('id', docId);


			let update_user = await supabase
							  .from('user')
							  .update([{
								    	license_date: new Date(tanggalAkhir),
								 		
									}])
							  .eq('id', userId);

			
			
			
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


	    	this.fetchData();

	    	//this.fetchAPI(telepon, message);
			
		}
	}

	onApproveConfirm(docId, userId, tanggalAkhir, telepon) {
		
	    Alert.alert(
	      "Warning",
	      "Apakah anda yakin?",
	      [
	        { text: "Cancel" },
	        { text: "OK", onPress: () => this.onSubmit(docId, userId, tanggalAkhir, telepon) }
	      ],
	    );
	}

	fetchAPI(telepon, message) {
 		//https://console.zenziva.net/wareguler/api/sendWA/
 		//https://console.zenziva.net/reguler/api/sendsms/
 		fetch('https://console.zenziva.net/wareguler/api/sendWA/',
	 		{
	 		   method: 'POST', 
	 		   headers: { 'Content-Type': 'application/json' },
			   body: JSON.stringify({
			     'userkey': '057eaa734f70',
			     'passkey' : '85a0025dd95930c35959a977',
			     'to' : telepon,
			     'message' : message
			   }), 
	 		}
 		)
        .then((response) => response.json())
        .then((json) => {
            console.log( json)
        })
        .catch((error) => console.error(error));
 	}

	onDesc(item) {
		return(
			<View>
				<Caption style={{ fontSize: 14 }}>Tanggal Mulai: {dateFormatSupa(item.tanggal_mulai)}</Caption>
				<Caption style={{ fontSize: 14 }}>Tanggal Akhir: {dateFormatSupa(item.tanggal_akhir)}</Caption>
			</View>
		);
	}

	
	onRight(item) {
		let valueStatusBayar = '';
		if(item.status_bayar == 'paid') {
			valueStatusBayar = 'Sudah Bayar';
		}

	    return(
	      <View>
	        <Subheading style={styleApp.Subheading}>{thousandFormat(item.nominal)}</Subheading>
	        
 		  	<Button 
              onPress={() => this.onApproveConfirm(item.id, item.user_id, item.tanggal_akhir, item.user.telepon)}
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
			      <Appbar.Content title="Verifikasi Pembayaran" color= {theme.colors.primary}/>
			      <Appbar.Action icon="archive-outline" color={theme.colors.primary} onPress={() => this.props.navigation.navigate('PaymentHistoryScreen')} />
			    </Appbar.Header>
			    
			    <FlatList
			      keyboardShouldPersistTaps="handled"
                  data={this.state.dataList}
                  keyExtractor={(item) => item.id}
                  style={styleApp.FlatList}
                  renderItem={({ item }) => (
                    <View>
                    	<List.Item
			              title={item.user.nama+' '+'('+item.user.nama_usaha+')'}
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
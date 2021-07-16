import * as React from 'react';
import { ScrollView, View, FlatList, Alert, Text } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button, HelperText, Divider, Portal, Dialog, List, Caption, Subheading, Chip } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';

import supabase from '../../config/supabase.js';
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

class UserLisensiPerpanjangScreen extends ValidationComponent {

	constructor(props) {
	    super(props);

	    this.state = store.getState();  
	    store.subscribe(()=>{
	      this.setState(store.getState());
	    });

	    this.state = {
	    	...this.state,

	    	dialogDisplay: false,
	    	nominal: 0,

	    };
	}

	componentDidMount() {
		this.fetchDataBank();
		this.fetchDataPaket();

		/*let nominal = 180000 + this.getRandomInt();
		this.setState({nominal: nominal});*/
	}

	/*async fetchData() {
	    //data
	    let self = this;

	    let userId = this.props.route.params.userId;

	    //query
	    let tanggalMulai = '';
	    let tanggalAkhir= '';

	    let query = firebase.firestore().collection('userLicense').where('userId', '==', userId).orderBy('tanggalMulai', 'desc').limit(1)
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
	}*/

	async fetchDataBank() {

		let { data:bank_data, error } = await supabase
		      .from('ref_bank')
		      .select('id, nama, rek_no, rek_nama')

	    this.setState({ bankData: bank_data });
	   	
	}

	async fetchDataPaket() {
		
        let license_date = this.props.route.params.license_date;
        let randomNominal = Math.floor(Math.random() * (99 - 10 + 1) ) + 10;

		//let harga = docData.harga + randomNominal;

        let paketData = [];
	    let { data, error } = await supabase
		      .from('ref_license_paket')
		      .select('id, nama, harga, harga_bulanan, durasi')

		data.map(doc => {

		let licenseDateNew = new Date(license_date);
		licenseDateNew.setDate(licenseDateNew.getDate() + doc.durasi);

		  paketData.push({
		  	id: doc.id,
            nama : doc.nama,
            harga : doc.harga + randomNominal,
            harga_bulanan : doc.hargaBulanan,
            durasi : doc.durasi,
            licenseDate: license_date,
            licenseDateNew: licenseDateNew,
		  });
		});
		

	    this.setState({ paketData: paketData });

	    store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
        });
	   	
	}


	onClose() {

		let user_id = this.props.route.params.user_id;
		
		this.setState({dialogDisplay:false});
	    this.props.navigation.push('UserLisensiScreen', {user_id:user_id});
	}

	onSelectConfirm(harga, licenseDateNew) {
	    Alert.alert(
	      "Warning",
	      "Apakah anda yakin?",
	      [
	        { text: "Cancel" },
	        { text: "OK", onPress: () => this.onSelect(harga, licenseDateNew) }
	      ],
	    );
	}


	async onSelect(harga, licenseDateNew) {
		
		if(this.isFormValid()) {
			
			let user_id = this.props.route.params.user_id;
			let nama = this.props.route.params.nama;
			let nama_usaha = this.props.route.params.nama_usaha;
			let license_date = this.props.route.params.license_date;

			let tanggal_mulai = ''; 
				tanggal_mulai = dateFilterFormat(new Date(license_date));
				tanggal_mulai.setDate(tanggal_mulai.getDate() + 1);

			let tanggal_akhir = dateFilterFormat(licenseDateNew);
			let nominal = harga;

			let currTime = new Date();
	        let result = [];

			
				result = await supabase
				  .from('user_license')
				  .insert([{ 	
			  				user_id: user_id,
			  				tanggal_mulai: tanggal_mulai, 
							tanggal_akhir: tanggal_akhir, 
							nominal: clearThousandFormat(nominal),
							status_bayar: 'not_paid',
							status_license: 'not_approved',
			  				_created_at:currTime, 
					    	/*_created_by:this.state.uid,
					    	_updated_by:this.state.uid,*/
					    }]);

			this.setState({dialogDisplay:true, displayHarga:harga});
			
		
	    }
	}

	onRight(item) {
		
	    return(
	      <View>
	        <Subheading style={styleApp.Subheading}>{thousandFormat(item.harga)}</Subheading>
	       
	        <Chip mode="outlined" style={{marginTop:5, backgroundColor:theme.colors.primary, justifyContent: "center", alignItems: "center"}} textStyle={{color:theme.colors.background, fontSize:16}} onPress={() => this.onSelectConfirm(item.harga, item.licenseDateNew)}>Pilih</Chip>
	      </View>
	    );
	}

	onDesc(item) {
	    return(
	      <View>
	        <Caption style={{ fontSize: 14 }}>{'Berlaku : '+dateFormat(item.licenseDateNew)}</Caption>  
	      </View>
	    );
	}


	render() {
	    return (
	    	<PaperProvider theme={theme}>
			    <Appbar.Header style={styleApp.Appbar}>
			      <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
			      <Appbar.Content title="Pepanjangan Lisensi User" color= {theme.colors.primary}/>
			    </Appbar.Header>

			     <FlatList
			      keyboardShouldPersistTaps="handled"
                  data={this.state.paketData}
                  keyExtractor={(item) => item.id}
                  style={styleApp.FlatList}
                  renderItem={({ item }) => (
                    <View>
                    	<List.Item
			              title={item.nama}
			              titleStyle={{fontSize:17, fontWeight:'bold'}}
			              description={() => this.onDesc(item)}
			              right={() => this.onRight(item)}
			              onPress={() => this.onSelectConfirm(item.harga, item.licenseDateNew)}
			            />
			            <Divider />
                    </View>
                  )}
                />

				<Portal>
			        <Dialog visible={this.state.dialogDisplay} onDismiss={() => this.onClose()}>
			          <Dialog.Content>
		          	
	          			<List.Item
			              title="Total"
			              titleStyle={{fontWeight:'bold', fontSize: 18}}
			              description={() => <Subheading style={{ fontWeight:'bold', fontSize: 18 }}>{thousandFormat(this.state.displayHarga)}</Subheading>}
			            />
		          		
			          	<List.Section style={{ marginTop:-15 }}>
					    	<List.Item
				              title="Rekening Pembayaran"
				              titleStyle={{fontWeight:'bold'}}
				            />
				            <FlatList
				              data={this.state.bankData}
				              keyExtractor={(item) => item.id}
				              style={{ backgroundColor:'#fff' }}
				              renderItem={({ item }) => (
		                    	<List.Item
					              title={item.nama}
					              description={item.rek_no+'\n'+item.rek_nama}
					              style={{ marginTop:-15 }}
					            />
				              )}
				            />
				        </List.Section>
			          </Dialog.Content>
			          <Dialog.Actions>
			            <Button onPress={() => this.onClose()}>OK, SAYA MENGERTI</Button>
			          </Dialog.Actions>
			        </Dialog>
			    </Portal>

			    {/*<ScrollView style={styleApp.ScrollView}>
			  		
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
				</Button>*/}


			</PaperProvider>
	    )
	}
}

export default UserLisensiPerpanjangScreen;
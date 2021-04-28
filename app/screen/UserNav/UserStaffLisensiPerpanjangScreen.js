import * as React from 'react';
import { ScrollView, View, FlatList, Alert, Text } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button, HelperText, Divider, Portal, Dialog, List, Caption, Subheading, Chip } from 'react-native-paper';
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
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });
        
		let query = firebase.firestore().collection('referensi').doc('bank').collection('bank');

	    //data
	    const bankData = [];

	    const docList = await query.get();
		docList.forEach(doc => {
		  const docData = doc.data();
		  bankData.push({
		  	id: doc.id,
            nama : docData.nama,
            rekNo : docData.rekNo,
            rekNama : docData.rekNama,
		  });
		});

	    this.setState({ bankData: bankData });
	}

	async fetchDataPaket() {
		
        let licenseDate = this.props.route.params.licenseDate;
        let randomNominal = Math.floor(Math.random() * (99 - 10 + 1) ) + 10;

		let query = firebase.firestore().collection('referensi').doc('lisensiPaket').collection('lisensiPaket');

	    //data
	    const paketData = [];

	    const docList = await query.get();
		docList.forEach(doc => {
		  const docData = doc.data();

		  let licenseDateNew = new Date(licenseDate.seconds * 1000);
		  licenseDateNew.setDate(licenseDateNew.getDate() + docData.durasi);

		  let harga = docData.harga + randomNominal;

		  paketData.push({
		  	id: doc.id,
            nama : docData.nama,
            harga : harga,
            hargaBulanan : docData.hargaBulanan,
            durasi : docData.durasi,
            licenseDate: licenseDate,
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

		let staffId = this.props.route.params.staffId;
		
		this.setState({dialogDisplay:false});
	    this.props.navigation.push('UserStaffLisensiScreen', {staffId:staffId});
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
			
			let staffId = this.props.route.params.staffId;
			let nama = this.props.route.params.nama;
			let namaUsaha = this.props.route.params.namaUsaha;
			let licenseDate = this.props.route.params.licenseDate;

			let tanggalMulai = ''; 
				tanggalMulai = dateFilterFormat(new Date(licenseDate.seconds * 1000));
				tanggalMulai.setDate(tanggalMulai.getDate() + 1);

			let tanggalAkhir = dateFilterFormat(licenseDateNew);
			let nominal = harga;


			const dataInsert = { 
								 userId: staffId,
								 namaUsaha: namaUsaha,
								 nama: nama,
								 tanggalMulai: tanggalMulai, 
								 tanggalAkhir: tanggalAkhir, 
								 nominal: clearThousandFormat(nominal),
								 statusBayar: 'belumBayar',
								 statusLicense: 'belumDisetujui'
								};

			await firebase.firestore().collection('userLicense').doc().set(dataInsert);
			
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


	/*async onSubmit() {
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

			let userId = this.props.route.params.userId;

			const dataInsert = { 
								 userId: userId,
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

	        this.props.navigation.navigate('UserLisensiScreen');
		}
	}

	getRandomInt(max=100) {
	  return Math.floor(Math.random() * Math.floor(max));
	}*/

	render() {
	    return (
	    	<PaperProvider theme={theme}>
			    <Appbar.Header style={styleApp.Appbar}>
			      <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
			      <Appbar.Content title="Pepanjangan Lisensi Staff" color= {theme.colors.primary}/>
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
					              description={item.rekNo+'\n'+item.rekNama}
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

export default UserStaffLisensiPerpanjangScreen;
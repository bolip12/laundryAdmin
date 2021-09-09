import * as React from 'react';
import { View, FlatList, Alert, Text, ScrollView, Linking} from 'react-native';
import { Provider as PaperProvider, Appbar, Searchbar, List, Divider, Chip, Portal, Caption, Subheading, Dialog, TextInput, Button, IconButton, Badge, RadioButton } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';
import { showMessage } from "react-native-flash-message";

import supabase from '../../config/supabase.js';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import store from '../../config/storeApp';

import FormBottom from '../../comp/formBottom.js';
import thousandFormat from '../../comp/thousandFormat.js';
import clearThousandFormat from '../../comp/clearThousandFormat.js';
import dateFormat from '../../comp/dateFormat.js';
import dateFormatSupa from '../../comp/dateFormatSupa.js';
import dateFormatShort from '../../comp/dateFormatShort.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import dateFormatBayar from '../../comp/dateFormatBayar.js';

class UserStaffLisensiScreen extends ValidationComponent {
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

	}

	componentDidUpdate(prevProps, prevState) {
	   /* if(prevState.notifDisplay !== this.state.notifDisplay) {
	      this.fetchData();
	    }*/
	}


	componentDidMount() {
		this.fetchData();
		this.fetchDataBank();
		this.fetchDataUser();
	}

	async fetchData() {
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

        let staffId = this.props.route.params.staffId;

        let { data, error } = await supabase
		      .from('user_license')
		      .select('id, user:user_id ( nama, telepon ), tanggal_mulai, tanggal_akhir, nominal, status_license, status_bayar')
		      .eq('user_id', staffId)
		      .order('tanggal_mulai', {ascending:false})

		//result
		this.setState({dataList:data});
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
        });
		
	}

	async fetchDataBank() {

		let { data:bank_data, error } = await supabase
		      .from('ref_bank')
		      .select('id, nama, rek_no, rek_nama')

	    this.setState({ bankData: bank_data });
	   	
	}

	async fetchDataUser() {

		let staffId = this.props.route.params.staffId;

		let { data, error } = await supabase
          .from('user')
          .select('id, telepon')          
          .eq('id', staffId)
          .single()

      this.setState({
        telepon:data.telepon,  
      });
	   	
	}

	async onSubmit() {

		if(this.isFormValid()) {
			store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:true }
	        });

	        let currDate = dateFormatBayar(new Date());
			
			let response = await supabase
							  .from('user_license')
							  .update([{
								    	status_bayar: 'paid',
								 		bank_id: this.state.radioChecked,
								 		tanggal_bayar: currDate,
									}])
							  .eq('id', this.state.docId);

			if(response.error) {
				showMessage({
		          message: response.error.message,
		          icon: 'warning',
		          backgroundColor: 'red',
		          color: theme.colors.background,
		        });
		    } else {
		        showMessage({
		          message: 'Data berhasil disimpan',
		          icon: 'success',
		          backgroundColor: theme.colors.primary,
		          color: theme.colors.background,
		        }); 
		    }

	        store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:false }
	        });

	        this.toggleForm();
	        this.fetchData();
		}
	}

	toggleForm(docId) {
	    this.setState({formDisplay: !this.state.formDisplay});
	    this.setState({docId:docId});
	    
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
	        <Subheading style={styleApp.Subheading}>{item.nominal == 0 ? 'Gratis' : thousandFormat(item.nominal)}</Subheading>
	        { item.status_bayar == 'not_paid' &&
 		  	<Button 
              onPress={() => this.toggleForm(item.id)}
              mode="contained" 
              style={{ height: 35 ,justifyContent: 'center', marginTop:10 }}
            > 
              Bayar 
            </Button>
            }

            { item.status_bayar == 'paid' &&
            <Chip mode="outlined" style={{ borderRadius: 3, height:37, marginTop:5, borderColor: 'green', justifyContent: "center", alignItems: "center"}} textStyle={{fontSize:13, color:'green'}}>{valueStatusBayar}</Chip>
        	}
	      </View>
	    );
	}

	radioLabel(item) {
		return (
			<View>
				<Subheading>{item.nama}</Subheading>
				<Caption>{item.rek_no}</Caption>
				<Caption>{item.rek_nama}</Caption>
			</View>
		);
	}
	

	onWhatsapp() {
		let phone = '+62'+this.state.telepon;

    Linking.openURL('whatsapp://send?phone='+phone);
	}

	render() {
	    return (
	    	<PaperProvider theme={theme}>
			    <Appbar.Header style={styleApp.Appbar}>
			      <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
			      <Appbar.Content title="Staff Lisensi" color= {theme.colors.primary}/>
			       <Appbar.Action icon="whatsapp" color= {theme.colors.primary} onPress={() => this.onWhatsapp()} />
			    </Appbar.Header>
			    
			    <FlatList
			      keyboardShouldPersistTaps="handled"
                  data={this.state.dataList}
                  keyExtractor={(item) => item.id}
                  style={styleApp.FlatList}
                  renderItem={({ item }) => (
                    <View>
                    	<List.Item
			              title={item.user.nama}
			              description={() => this.onDesc(item)}
			              right={() => this.onRight(item)}
			              //onPress={() => this.onSelect(item.id)}
			            />
			            <Divider />
                    </View>
                  )}
                />

                { this.state.status_bayar != 'not_paid' &&
                <Button 
		            mode="contained"
		            icon="plus" 
		            onPress={() => this.props.navigation.navigate('UserStaffLisensiPerpanjangScreen', {staffId:this.props.route.params.staffId, licenseDate:this.props.route.params.licenseDate, namaUsaha:this.props.route.params.namaUsaha, nama:this.props.route.params.nama})}
		            disabled={this.state.isLoading}
		            style={styleApp.Button}
		         >
		            Perpanjang
		        </Button>
		        }

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
		                <RadioButton.Item label={this.radioLabel(item)} value={item.id} color={theme.colors.primary} />
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

export default UserStaffLisensiScreen;
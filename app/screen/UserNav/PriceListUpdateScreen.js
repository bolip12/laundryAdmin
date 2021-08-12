import * as React from 'react';
import { ScrollView, View, FlatList, Alert, Text } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button, HelperText, Divider } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';
import { showMessage } from "react-native-flash-message";

import supabase from '../../config/supabase.js';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import store from '../../config/storeApp';

import DateTimeInput from '../../comp/dateTimeInput.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import dateFormat from '../../comp/dateFormat.js';
import clearThousandFormat from '../../comp/clearThousandFormat.js';
import thousandFormat from '../../comp/thousandFormat.js';

class PriceListUpdateScreen extends ValidationComponent {

	constructor(props) {
	    super(props);

	    this.state = store.getState();  
	    store.subscribe(()=>{
	      this.setState(store.getState());
	    });

	    this.state = {
	    	...this.state,

	    };
	}

	componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async fetchData() {
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:true }
    });

    let id = this.props.route.params.id;

    let { data, error } = await supabase
          .from('ref_license_paket')
          .select('id, nama, harga_bulanan, harga, durasi, deskripsi')         
          .eq('id', id)
          .single();

    //result
    this.setState({
    	nama:data.nama,
    	harga_bulanan:data.harga_bulanan,
    	harga:data.harga,
    	durasi:data.durasi,
    	deskripsi:data.deskripsi,
    });
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });

  }

	async onSubmit() {
		this.validate({
			nama: {required:true},
			harga: {required:true},
			harga_bulanan: {required:true},
			durasi: {required:true},
		});


		if(this.isFormValid()) {
			store.dispatch({
          type: 'LOADING',
          payload: { isLoading:true }
      });

			let id = this.props.route.params.id;
			let response = [];

	       	response = await supabase
				  .from('ref_license_paket')
				  update([{ 	
			  				nominal: clearThousandFormat(this.state.nominal),
			  				keterangan:keterangan,
					    	_updated_at:currTime,
					    	_updated_by:this.state.uid,
					    }])
				  .eq('id', id);

			store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });

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


	    this.props.navigation.navigate('PriceListScreen');
		}
	}

	render() {
	    return (
	    	<PaperProvider theme={theme}>
			    <Appbar.Header style={styleApp.Appbar}>
			      <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
			      <Appbar.Content title="Price List Update" color= {theme.colors.primary}/>
			    </Appbar.Header>

			    <ScrollView style={styleApp.ScrollView}>

			    	<TextInput
					    label="Nama Paket"
					    value={this.state.nama}
					    onChangeText={text => this.setState({nama: text})}
					    style={styleApp.TextInput}																														
				    />
				    {this.isFieldInError('nama') && this.getErrorsInField('nama').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

				    <TextInput
					    label="Harga Bulanan"
					    value={thousandFormat(this.state.harga_bulanan)}
					    keyboardType={'numeric'}
					    onChangeText={text => this.setState({harga_bulanan: text})}
					    style={styleApp.TextInput}																														
				    />
				    {this.isFieldInError('harga_bulanan') && this.getErrorsInField('harga_bulanan').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

				    <TextInput
					    label="Harga"
					    value={thousandFormat(this.state.harga)}
					    keyboardType={'numeric'}
					    onChangeText={text => this.setState({harga: text})}
					    style={styleApp.TextInput}																														
				    />
				    {this.isFieldInError('harga') && this.getErrorsInField('harga').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

				    <TextInput
					    label="Durasi"
					    value={thousandFormat(this.state.durasi)}
					    keyboardType={'numeric'}
					    onChangeText={text => this.setState({durasi: text})}
					    style={styleApp.TextInput}																														
				    />
				    {this.isFieldInError('durasi') && this.getErrorsInField('durasi').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

				    <TextInput
					    label="Deskripsi"
					    value={thousandFormat(this.state.deskripsi)}
					    onChangeText={text => this.setState({deskripsi: text})}
					    style={styleApp.TextInput}																														
				    />

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

export default PriceListUpdateScreen;
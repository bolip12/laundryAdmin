import * as React from 'react';
import { View, FlatList, Alert, Text, ScrollView, Dimensions } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Checkbox, Divider, Button, Chip, Subheading, IconButton, Colors, Searchbar } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';

import supabase from '../../config/supabase.js';
import theme from '../../config/theme.js';
import store from '../../config/storeApp';
import styleApp from '../../config/styleApp.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import dateFormat from '../../comp/dateFormat.js';
import dateFormatShort from '../../comp/dateFormatShort.js';
import DateTimeInput from '../../comp/dateTimeInput.js';
import thousandFormat from '../../comp/thousandFormat.js';
import clearThousandFormat from '../../comp/clearThousandFormat.js';
import FormBottom from '../../comp/formBottom.js';
import checkRangeDate from '../../comp/checkRangeDate.js';
import dateFormatBayar from '../../comp/dateFormatBayar.js';
import dateFormatSupa from '../../comp/dateFormatSupa.js';

class LaporanPemabayaranScreen extends ValidationComponent {

	constructor(props) {
    	super(props);

	    //redux variable
	    this.state = store.getState();  
	    store.subscribe(()=>{
	      this.setState(store.getState());
	    });

    	this.state = {
      		...this.state,

      		StartDate:'',
	        EndDate:new Date(),
      		
      		formDisplayFilter: false,

      		inputSearch: '',
    	};
    	
 	}

	componentDidMount() {
		this.fetchData();
	}

 	componentDidUpdate(prevProps, prevState) {
		/*if(prevState.StartDate !== this.state.StartDate) {
	    	this.fetchData();
		}

		if(prevState.EndDate !== this.state.EndDate) {
	    	this.fetchData();
		}*/

		if(prevState.inputSearch !== this.state.inputSearch) {
			this.fetchData();
		}

		if(prevState.formDisplayFilter !== this.state.formDisplayFilter && !this.state.formDisplayFilter) {
	    	this.fetchData();
	    }

		
	}
 		
 
	async fetchData() {
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

        let StartDate = new Date();
		if(this.state.StartDate == '') {
			StartDate.setDate(StartDate.getDate() - 7);
		} else {
			StartDate = this.state.StartDate;
		}
        const StartDateFilter = dateFormatBayar(StartDate);
        
        const EndDate = this.state.EndDate;
        const EndDateFilter = dateFormatBayar(EndDate);

        let keyword = this.state.inputSearch.toLowerCase();
        
        /*let { data, error } = await supabase
		      .from('user_license')
		      .select('id, user:user_id (nama, nama_usaha, keyword), nominal, status_license, status_bayar, tanggal_bayar')
		      .like('user.keyword', '%'+keyword+'%')
		      .gte('tanggal_bayar', StartDateFilter)
		      .lte('tanggal_bayar', EndDateFilter)
		      console.log(data)*/

      	let { data, error } = await supabase
			      .rpc('admin_pembayaran_laporan', { 
			      	keyword_filter: keyword,
			      	startdate_filter: StartDateFilter, 
			      	enddate_filter: EndDateFilter 
			      })
	
		//result
		this.setState({dataList:data, StartDate:StartDate, EndDate:EndDate});
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
        });
	}

	toggleFormFilter() {
	    this.setState({formDisplayFilter: !this.state.formDisplayFilter});
	}

	onSetFilter() {
		if(checkRangeDate(this.state.StartDate, this.state.EndDate, 31)) {
			this.toggleFormFilter();
		}
	}

	onRight(item) {
		let valueStatusLicense = '';
		let colorStatusLicense = '';
		if(item.status_license == 'approved') {
			valueStatusLicense = 'Sudah Disetujui';
			colorStatusLicense = 'green';
		} else {
			valueStatusLicense = 'Belum Disetujui';
			colorStatusLicense = 'red';
		}


	    return(
	      <View>
	      <Subheading style={styleApp.Subheading}>{item.nominal == 0 ? 'Gratis' : dateFormatSupa(item.tanggal_bayar)}</Subheading>
	       <Chip mode="outlined" style={{marginTop:5, borderColor:colorStatusLicense, justifyContent: "center", alignItems: "center"}} textStyle={{color:colorStatusLicense, fontSize:13}}>{valueStatusLicense}</Chip>

	      </View>
	    );
	}

	render() {
	    return (
	    	<PaperProvider theme={theme}>
			    <Appbar.Header style={styleApp.Appbar}>
			      <Appbar.BackAction color={theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
			      <Appbar.Content title="Laporan Pembayaran" color={theme.colors.primary}/>
			    </Appbar.Header>
			    

		        <View style={{ backgroundColor: '#ffffff' }}>
                	<List.Item
		              title={dateFormat(this.state.StartDate)+' '+'-'+' '+dateFormat(this.state.EndDate)}
		              titleStyle={{fontSize:17, fontWeight:'bold'}}
		              left={props => <List.Icon {...props} icon="magnify" color={Colors.green800}/>}
		              onPress={() => this.toggleFormFilter()}
		            />
		            <Divider />

                </View>

                <Searchbar
		            placeholder='Cari Nama'
		            fontSize={15}
		            onChangeText={(text) => this.setState({ inputSearch: text })}
		            value={this.state.inputSearch}
		            //onEndEditing={() => this.fetchData(this.state.kategoriId)}
		        />

			   {this.state.dataList &&
			   	<FlatList
			      keyboardShouldPersistTaps="handled"
                  data={this.state.dataList}
                  keyExtractor={(item) => item.id}
                  style={styleApp.FlatList}
                  renderItem={({ item }) => (
                    <View>
                    	<List.Item
			              title={item.nama+' ('+item.nama_usaha+')'}
			              titleStyle={{fontSize:17, fontWeight:'bold'}}
			              description={thousandFormat(item.nominal)}
			              descriptionStyle={{fontSize:15, fontWeight:'bold'}}
		             	  right={() => this.onRight(item)}
		             	 
			            />
			           <Divider />
                    </View>

                  )}
                /> 
            	}



                <FormBottom
		        	title="Rentang Tanggal Bayar"
		        	display={this.state.formDisplayFilter}
		        	onToggleForm={status => this.toggleFormFilter()}
		        >
					<View style={{ backgroundColor:'#ffffff'}}>
	
						<DateTimeInput
							title="Start Date"
							value={this.state.StartDate}
				         	mode="date"
				         	onChangeDate={(date) => this.setState({StartDate:date})}
				         	style={{ marginTop:-10}}
						/>
						<Divider />

						<DateTimeInput
							title="End Date"
							value={this.state.EndDate}
				         	mode="date"
				         	onChangeDate={(date) => this.setState({EndDate:date})}
				         	style={{ marginTop:-10}}
						/>
						<Divider />
		          	</View>

	              	<Button 
				    	mode="contained"
				    	icon="content-save-outline" 
				    	onPress={() => this.onSetFilter()}
				    	style={styleApp.Button}
				  	>
					    Filter
				 	</Button>

		   		</FormBottom>


			</PaperProvider>
	    )
	}
}
const windowWidth = Dimensions.get('window').width;

export default LaporanPemabayaranScreen;
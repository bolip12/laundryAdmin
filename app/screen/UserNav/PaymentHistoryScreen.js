import * as React from 'react';
import { View, FlatList, Alert, Text, ScrollView, Dimensions } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Checkbox, Divider, Button, Chip, Subheading, IconButton, Colors } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';

import supabase from '../../config/supabase.js';
import theme from '../../config/theme.js';
import store from '../../config/storeApp';
import styleApp from '../../config/styleApp.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import dateFormat from '../../comp/dateFormat.js';
import dateFormatSupa from '../../comp/dateFormatSupa.js';
import dateFormatShort from '../../comp/dateFormatShort.js';
import DateTimeInput from '../../comp/dateTimeInput.js';
import thousandFormat from '../../comp/thousandFormat.js';
import clearThousandFormat from '../../comp/clearThousandFormat.js';
import FormBottom from '../../comp/formBottom.js';
import checkRangeDate from '../../comp/checkRangeDate.js';
import dateFormatBayar from '../../comp/dateFormatBayar.js';

class PaymentHistoryScreen extends ValidationComponent {

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

      		currPage: 1,
	    	perPage: 5,
	    	disabledPage: false,
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

		if(prevState.formDisplayFilter !== this.state.formDisplayFilter && !this.state.formDisplayFilter) {
	    	this.fetchData();
	    }

	    if(prevState.currPage !== this.state.currPage && this.state.currPage !== 1) {
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

        let rangeStart = 0;
		let rangeEnd = (this.state.currPage * this.state.perPage) - 1;

        let { data, error, count } = await supabase
		      .from('user_license')
		      .select('id, user_id, user:user_id ( nama, nama_usaha, telepon ), tanggal_mulai, tanggal_akhir, nominal, status_license, status_bayar', {count:'exact'})
		      .eq('status_license', 'approved')
		      .gte('tanggal_bayar', StartDateFilter)
		      .lte('tanggal_bayar', EndDateFilter)
		      .range(rangeStart, rangeEnd)

		let disabledPage = false
	   		if(rangeEnd >= (count-1)) {
	   		disabledPage = true
	   	}

		//result
		this.setState({dataList:data, StartDate:StartDate, EndDate:EndDate, StartDateFilter:StartDateFilter, EndDateFilter:EndDateFilter, disabledPage:disabledPage});
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

	vieMoreButton() {
		if(this.state.disabledPage) {
	    	return false;
		} else {
			return (<Button icon="arrow-down" mode="text" onPress={() => this.setState({currPage:this.state.currPage+1})} style={{ margin:5 }}>
		              View More
		            </Button>);
		}
	}

	onDescription(item) {
	    return(
		    <View>

		      <View>
		      	<Chip icon="calendar-import" mode="outlined" style={{marginTop:5, borderColor:'white'}} textStyle={{fontSize:12}}>Mulai: {dateFormatSupa(item.tanggal_mulai)} </Chip>
		      	<Chip icon="calendar-export" mode="outlined" style={{marginTop:5, borderColor:'white'}} textStyle={{fontSize:12}}>Akhir: {dateFormatSupa(item.tanggal_akhir)}</Chip>
		      </View>
		    </View>
	    );
	  }

	/*onRight(item) {
		let colorStatusBayar = '';
		if(item.statusBayar == 'lunas') {
			colorStatusBayar = 'green';
		} else if(item.statusBayar == 'Belum Bayar') {
			colorStatusBayar = 'red';
		} else {
			colorStatusBayar = 'orange';
		}


	    return(
	      <View>
	        <Subheading style={styleApp.Subheading}>{thousandFormat(item.totalBiaya)}</Subheading>
	        <Subheading style={{color:colorStatusBayar, fontSize:13, alignSelf:'flex-end'}}>{item.statusBayar.toUpperCase()}</Subheading>

	      </View>
	    );
	}*/

	render() {
	    return (
	    	<PaperProvider theme={theme}>
			    <Appbar.Header style={styleApp.Appbar}>
			      <Appbar.BackAction color={theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
			      <Appbar.Content title="Riwayat Payment" color={theme.colors.primary}/>
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

			   <FlatList
			      keyboardShouldPersistTaps="handled"
                  data={this.state.dataList}
                  keyExtractor={(item) => item.id}
                  style={styleApp.FlatList}
                  ItemSeparatorComponent={() => <Divider />}
                  ListFooterComponent={() => this.vieMoreButton()}
                  renderItem={({ item }) => (
                    <View>
                    	<List.Item
			              title={item.user.nama+' ('+item.user.nama_usaha+')'}
			              titleStyle={{fontSize:17, fontWeight:'bold'}}
			              description={() => this.onDescription(item)}
		             	  right={() => <Subheading style={styleApp.Subheading}>{item.nominal == 0 ? 'Gratis' : thousandFormat(item.nominal)}</Subheading>}
		             	 
			            />
			           <Divider />
                    </View>

                  )}
                /> 

                <FormBottom
		        	title="Rentang Tanggal Akhir"
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

export default PaymentHistoryScreen;
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import navbar from './navbar';
var ReactRouter = require('react-router');
import {Table,FormGroup,ControlLabel,FormControl,Button} from 'react-bootstrap'
import Datetime from 'react-datetime';
//import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { globalUserName } from './navbar';



const dbSource = "http://www.cise.ufl.edu/~sedlabad/db.php?";
var foodItem;

var FoodLog = React.createClass({
	selectServingSize : 100,
	propTypes:{
		results: React.PropTypes.array,
		name: React.PropTypes.string,
		id: React.PropTypes.string, 
	},
	
	 
	getInitialState: function(){
		return ({
		  showModal:false,
		  data:[],
		  servingSize: [], //TODO:fetch serving size for the given food and pass here
		  email: globalUserName,
		  meal_date: '',
		  meal: '',
		  food_item: '',
		  food_id: '',
		  food_desc: '',
		  quantity: ''
		});
	},
	
	close: function(){
		this.setState({
		  showModal:false
		});
	 },
	 
	 updateServingSize: function(val){
		this.selectServingSize = val;
		this.loadContent();
	},
	
	loadServingSize: function(){
		var query = "select amount || ' ' || description as quantity, gm_weight as gm from weight where food_id = " + this.props.id;
		  fetch(dbSource.concat(query))
		  .then((response) => response.json())
		  .then((json) => {
			  json.push({"QUANTITY":"100gm", "GM":100});
			  this.setState({
				servingSize : json
			  });
		  });
	},
	
	
	
	formQuery: function(search_term){
		var query = "select id, short_desc from food where LOWER(short_desc) like '%" + search_term.toLowerCase() + "%'";
		console.log('query: ', query);
		return query;
	},
	loadContent:function(e){
		this.setState({
			data : [],
        });
		console.log('search: ', e.target.value);
		foodItem = e.target.value;
		//var query = this.formQuery(e.target.value);
		var query = "select id, short_desc from food where LOWER(short_desc) like '%" + e.target.value.toLowerCase() + "%'";
		console.log('query: ', query);
		fetch(dbSource.concat(query))
		.then((response) => response.json())
		.then((json) => {
			console.log('json ', json)
			this.setState({
			data : json
        });
      });
	},
	
	open:function(){
		this.loadContent();
		this.loadServingSize();
		this.getQuantity();
		/*this.setState({
		showModal:true
		});*/
	},

	getQuantity: function(e) {
		this.setState({
			food_id: e.target.value,
			food_desc: e.target[e.target.selectedIndex].text
		});
		console.log("selected ", e.target[e.target.selectedIndex].text);
		var query = "select amount, description from weight where food_id=" + e.target.value;
		console.log('query: ', query);
		fetch(dbSource.concat(query))
		.then((response) => response.json())
		.then((json) => {
			console.log('json ', json)
			this.setState({
			servingSize : json
        });
      });
		
	},
	
	handleDateChange: function(e) {
		//console.log('date', e.format('YYYY-MM-DD'));
		this.setState({
			meal_date: e.format('YYYY-MM-DD')
		});
	},
	
	handleMealChange: function(e) {
		this.setState({
			meal: e.target.value
		});
	},
	
	handleServingSizeChange: function(e) {
		this.setState({
			quantity: e.target.value
		});
	},
	
	insertData: function(){
		var query = "insert into log values(" + this.state.food_id + "," + this.state.email + "," + this.state.meal_date + "," + this.state.meal + "," + foodItem
						+ "," + this.state.food_desc + "," + this.state.quantity + ")";
		console.log('insert query: ', query);
		  fetch(dbSource.concat(query))
		  .then((response) => response.json())
		  .then((json) => {
			  console.log('json ', json);
			  //location.reload();
		  });
	},	
		
	render: function() {
		//alert('in foodlog');
		return(
			<div>
				<Table responsive striped bordered condensed hover> 
					<thead>
					  <tr>
						<th>Date</th>
						<th>Meal</th>
						<th>Food</th>
						<th>Quantity/Serving Size</th>
					  </tr>
					</thead>
					<tbody>
					  <tr>
						<td height="250" width="200">
							<Datetime onChange={this.handleDateChange} />
						</td>
						<td> 
						<FormGroup controlId="formControlsSelect">
						  <ControlLabel>Select</ControlLabel>
						  <FormControl componentClass="select" placeholder="select" onChange={this.handleMealChange}>
							<option value="Breakfast">Breakfast</option>
							<option value="Lunch">Lunch</option>
							<option value="Snacks">Snacks</option>
							<option value="Dinner">Dinner</option>
						  </FormControl>
						</FormGroup>	
							</td>
						<td> 
							<FormGroup>
							  <FormControl type="text" placeholder="Search" onChange={this.loadContent}/>
							</FormGroup>
							<FormGroup controlId="formControlsSelect">
							  <ControlLabel>Select</ControlLabel>
							  <FormControl componentClass="select" placeholder="select" onChange={this.getQuantity}>
								{(function () {
									console.log('data:', this.state.data);
									var foodDescList = [];
									var count = 0;
									for(let foodDesc of this.state.data) {
										foodDescList.push(<option 
											key={count++}
											value={foodDesc.ID}>{foodDesc.SHORT_DESC}</option>);
									}
									return foodDescList;
								}).bind(this) ()}
							  </FormControl>
							</FormGroup>	
						</td>
						<td>
							<FormGroup controlId="formControlsSelect">
							  <ControlLabel>Select</ControlLabel>
							  <FormControl componentClass="select" placeholder="select" onChange={this.handleServingSizeChange}>
								{(function () {
									console.log('servingSize:', this.state.servingSize);
									var servingSizeList = [];
									var count = 0;
									for(let servingSize of this.state.servingSize) {
										servingSizeList.push(<option 
											key={count++}
											value={servingSize.AMOUNT+servingSize.DESCRIPTION}>{servingSize.AMOUNT+' '+servingSize.DESCRIPTION}</option>);
									}
									return servingSizeList;
								}).bind(this) ()}
							  </FormControl>
							</FormGroup>
							<Button bsStyle="primary" onClick={this.insertData}>Done</Button>
						</td>
					  </tr>
					</tbody>
				</Table>
			</div>
		);
	}
});

module.exports = FoodLog;




/*<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
								<DropdownToggle caret>
									Dropdown
								</DropdownToggle>
								<DropdownMenu right>
									<DropdownItem>Breakfast</DropdownItem>
									<DropdownItem divider/>
									<DropdownItem>Lunch</DropdownItem>
									<DropdownItem divider/>
									<DropdownItem>Snacks</DropdownItem>
									<DropdownItem divider/>
									<DropdownItem>Dinner</DropdownItem>
								</DropdownMenu>
							</Dropdown>*/
							
//<Button bsStyle="primary" onClick={this.handleInsertBtnClick.bind(this)}>Done</Button>

/*
<td>
							<Datetime
								renderDay={ this.renderDay }
								renderMonth={ this.renderMonth }
								renderYear={ this.renderYear }
							/>;
						</td>
						
						*/
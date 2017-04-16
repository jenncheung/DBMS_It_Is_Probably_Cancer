import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import navbar from './navbar';
var ReactRouter = require('react-router');
import {Table,FormGroup,ControlLabel,FormControl} from 'react-bootstrap'
//import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';



const dbSource = "http://www.cise.ufl.edu/~sedlabad/db.php?";


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
		  servingSize: [] //TODO:fetch serving size for the given food and pass here
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
			data : []
        });
		console.log('search: ', e.target.value);
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
	
	
	addRow: function (result) {
    return (<FoodLog 
              key={result.ID}
              id={result.ID}
              name={result.NAME}
              desc={result.DESCRIPTION}
              onBtnClick={this.onResultClick}
               />
           );
	},
  
	createResultTable: function (results) {
		return results.map(this.addRow);
	},
	getQuantity: function(e) {
		console.log("selected ", e.target.value);
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
	
		
	render: function() {
		//alert('in foodlog');
		return(
			<div>
				<Table responsive striped bordered condensed hover> 
					<thead>
					  <tr>
						<th>Meal</th>
						<th>Food</th>
						<th>Quantity/Serving Size</th>
					  </tr>
					</thead>
					<tbody>
					  <tr>
						<td> 
						<FormGroup controlId="formControlsSelect">
						  <ControlLabel></ControlLabel>
						  <FormControl componentClass="select" placeholder="select">
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
							  <FormControl componentClass="select" placeholder="select">
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
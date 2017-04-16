import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from "react-bootstrap";

import FoodSearch from './searchComponents/foodGroup';
import ResultContainer from './searchComponents/resultList';
import FilterComponent from './searchComponents/filterComponent';

//const dbSource = "http://localhost/database.php?";
const dbSource = "http://www.cise.ufl.edu/~sedlabad/db.php?";


const Search = React.createClass({
	getInitialState : function(){
		return {
			foodGroups:[],
			queryResults: []
			}
	},
	componentWillMount :function(){
		var query = "Select id, name from food_group";
		fetch(dbSource.concat(query))
		.then((response) => response.json())
		.then((json) => {
			this.setState({
				foodGroups : json
			});
		});
	},
	formQueryForFilters: function(filters){
		var q = "";

		filters.map(function(filter, index){
			if ((!isNaN(filter.nutrient)) && (filter.option !== 3 && filter.option !== 4) && (filter.min >= 0 || filter.max >= 0) && (filter.option === 2 || (filter.max !== -1 && filter.max > filter.min))){
				if (index !== 0){
					q += " intersect ";
				} 

				q += ` (select food_id from nutrition where nutrient_id = `;
				q += filter.nutrient;
				if (filter.option === 2){
					q += ` and amount = ` + filter.min;
				} 
				if (filter.option === 1){
					q += filter.min !== -1 ? (` and amount  > ` + filter.min) : ``;
					q += filter.max !== -1 ? (` and amount < ` + filter.max) : ``;
				}

				q += ` ) `;
			}
		});
		q = q.length !== 0? "select food_id from ( " + q + " ) " : "";
		//console.log("Filter Query = " + q);
		return q;
	},
	formQuery: function(foodgroups){
		var query = "select f.id, f.long_desc as name, g.name as description from food f JOIN food_group g on f.food_group_id = g.id "

		if (foodgroups.length !== 0 || document.getElementById('searchparam').value){
			query += " where ";

			//Add Search keyword
			if (document.getElementById('searchparam').value){
				query += " lower(long_desc) like '%".concat(document.getElementById('searchparam').value.replace(/ /g, "%").toLowerCase()).concat("%'");
				if (foodgroups.length !== 0){
					query += " and ";
				}	
			}

			//Add food group filter
			if (foodgroups.length !== 0){
				query += " food_group_id in (" + foodgroups.toString() + ")"
			}
		}
		//console.log("search query : "  + query);

		//Add filters - Not doing min/max for now
		var filters = this._nutrientFilter.getData();
		var filterQuery = this.formQueryForFilters(filters);
		if(filterQuery.length !== 0){
			query += ` and f.id in ( `;
			query += this.formQueryForFilters(filters);
			query += `)`
		}

		console.log(query);

		return query;
	},
	search : function(){
		this.setState({
			queryResults : []
		});
		//figure out food groups filter
		//There has to be a better way to do the following
		var foodgroups = [];
		var foodgroup = "";
		var fgData = this._foodGroup.getData();
		for(var i in fgData){
  			if (fgData[i] !== ","){
  				foodgroup += fgData[i];
  			} else {
  				foodgroups.push(foodgroup);
  				foodgroup = "";
  			}
		}

		if (foodgroup.length !== 0) foodgroups.push(foodgroup);

		if(document.getElementById('searchparam').value || foodgroups.length !== 0){
			var query = this.formQuery(foodgroups);
			//console.log(query);
			fetch(dbSource.concat(query))
			.then((response) => response.json())
			.then((json) => {
				document.getElementById('searchStatus').innerText = json.length + " Rows Found";
				if (json.length > 0) document.getElementById("searchStatus").className = "label label-success";
				else document.getElementById('searchStatus').className = "label label-danger";
				this.setState({
					queryResults : json
				});
			});	
		} else {
			document.getElementById('searchStatus').innerText = "No search criteria specified";
			document.getElementById('searchStatus').className = "label label-danger";
		}
	},
	render: function(){
		return (
			<div>
				<form className="form-horizontal">
				  <div className="form-group">
				    <label className="col-sm-2 control-label">Food Item</label>
				    <div className="col-sm-6">
				      <input type="text" className="form-control" placeholder="Food Name e.g Chicken" id="searchparam"/>
				    </div>
				  </div>
				  <div className="form-group">
				    <label  className="col-sm-2 control-label">In</label>
				    <div className="col-sm-6">
				      <FoodSearch ref={(ref) => this._foodGroup = ref} options={this.state.foodGroups}/>
				    </div>
				  </div>
				  <div className="form-group">
				    <div className="col-sm-offset-2 col-sm-6">		
						  <FilterComponent ref={(ref) => this._nutrientFilter = ref}/>
				  	</div>
				  </div>
				  <div className="form-group">
				    <div className="col-sm-offset-2 col-sm-6">
				      <Button bsStyle="default" onClick={this.search}>Search</Button>
				    </div>
				  </div>
		  		  <div className="form-group">
				    <div className="col-sm-offset-2 col-sm-6">		
						  <h5 id="searchStatus" className="col-sm-offset-2 col-sm-4"></h5>
				  	</div>
				  </div>
				</form>
			  <div id="results" className="col-sm-offset-1"><ResultContainer results={this.state.queryResults}/></div>	
			</div>
		);
	}
});

//ReactDOM.render(<Search />, document.getElementById("search"));
export default Search;

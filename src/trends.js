import React from 'react';
import Select from 'react-select';
import Datetime from 'react-datetime';
import {Button} from 'react-bootstrap';
import axios from 'axios';

var loginInfo = require('./navbar.js');
var Chart = require('chart.js');


const dbSource = "http://www.cise.ufl.edu/~sedlabad/db.php?";

const Trends = React.createClass({
	startDate:"", //1 week before today 
	endDate: "", //Today's date
	nutrientsID: "203, 204, 205, 208, 269 ,291 ,301 ,303 ,304 ,305 ,306 ,307 ,309 ,317 ,318 ,324 ,401 ,404 ,405 ,406 ,415 ,418 ,430 ,431 ,601", //Common Nutrients
	getInitialState : function(){
		return {
			chartData: [],
			chartOptions: [],
			nutrientID:0,		
			commonNutrients:[], //Move out of state - not dependent on this
			userID: "email@domain.com", //For the current user - Move to props
			renderGraph: false,
		}
	},
	componentWillMount :function(){
		var query = "select name as NAME, id as ID from nutrient where id in (" + this.nutrientsID + ")"; 
		fetch(dbSource.concat(query))
		.then((response) => response.json())
		.then((json) => {
			this.setState({
				commonNutrients : json
			});
		});	
	},
	handleNutrientChange: function(newValue){
		this.setState({
			nutrientID : newValue,
		});
	},
	startDateChange: function(newValue){
		var month = newValue.month() + 1;
		var date = newValue.date();
		var year = newValue.year();
		this.startDate = "" + date + "-" + month + "-" + year;
	},
	endDateChange: function(newValue){
		var month = newValue.month() + 1;
		var date = newValue.date();
		var year = newValue.year();
		this.endDate = "" + date + "-" + month + "-" + year;
	},
	formQuery: function(){
		var query = ` select to_Date(q1.meal_date) as DAY, sum(amount) as TOTAL
					 from nutrition join 
					 (select food_id, meal_date from log
					  where email = `;

		query += `'` + loginInfo.globalUserName + `'`;
		query += ` and meal_date <= TO_DATE ( '` + this.endDate + `', 'DD-MM-YYYY')`;
		query += ` and meal_date >= TO_DATE ( '` + this.startDate + `','DD-MM-YYYY')) q1 `;
		query += ` on nutrition.food_id = q1.food_id `;
		query += ` where nutrient_id = ` + this.state.nutrientID.ID;
		query += ` group by to_date(q1.meal_date) order by to_date(q1.meal_date) asc `;

		console.log(query);
		return query;
	},
	renderChart: function(){
	var _dataset = [];
    var _labels = [];
    var endDate = this.endDate;
    var startDate = this.startDate;
    var nID = this.state.nutrientID.ID;
	var queryForAvg = `select to_Date(q1.meal_date) as DAY, avg(amount) as TOTAL from nutrition join 
                        (select food_id, meal_date from log where meal_date <= TO_DATE ( ' `+ this.endDate + `', 'DD-MM-YYYY') and meal_date >= TO_DATE ( '` + this.startDate + `','DD-MM-YYYY')) q1  
                        on nutrition.food_id = q1.food_id  where nutrient_id = `+ this.state.nutrientID.ID + ` group by to_date(q1.meal_date) order by to_date(q1.meal_date)`
	
	var unit = "";
	fetch(dbSource + "select units from nutrient where id = " + this.state.nutrientID.ID)
	.then((response) => response.json())
	.then((json) => {
		unit = json[0].UNITS;
	});	

	axios
	    .get(dbSource.concat(queryForAvg))
	    .then(function (result) {
	        var _data = [];

	        for(var tuple in result.data) {
	            _data.push(result.data[tuple].TOTAL);
        		_labels.push(result.data[tuple].DAY);
	        }

	        _dataset.push({
	            label: 'Average Nutrient Consumption',
	            data: _data,
	            backgroundColor: [
	                'rgba(255, 199, 152, 0.2)',
	            ],
	            borderColor: [
	                'rgba(255,199,152,1)',
	            ],
	            borderWidth: 1
	        });
    	

		if (loginInfo.globalLoggedIn){
		//Get user's nutrient data
		var query = ` select to_Date(q1.meal_date) as DAY, sum(amount) as TOTAL
					 from nutrition join 
					 (select food_id, meal_date from log
					  where email = `;

        query += `'` + loginInfo.globalUserName + `'`;
		query += ` and meal_date <= TO_DATE ( '` + endDate + `', 'DD-MM-YYYY')`;
		query += ` and meal_date >= TO_DATE ( '` + startDate + `','DD-MM-YYYY')) q1 `;
		query += ` on nutrition.food_id = q1.food_id `;
		query += ` where nutrient_id = ` + nID;
		query += ` group by to_date(q1.meal_date) order by to_date(q1.meal_date) asc `;

		axios
		    .get(dbSource.concat(query))
		    .then(function (result) {
		        var _data = [];

		        for(var tuple in result.data) {
		            _data.push(result.data[tuple].TOTAL);
		        }

		        _dataset.push({
		            label: "Your intake",
		            data: _data,
		            backgroundColor: [
		                'rgba(255, 99, 132, 0.2)',
		            ],
		            borderColor: [
		                'rgba(255,99,132,1)',
		            ],
		            borderWidth: 1
		        });        
	    	var ctx = document.getElementById("trendsChart");
	            var trendsChart = new Chart(ctx, {
	                type: 'line',
	                data: {
	                    labels: _labels,
	                    datasets: _dataset
	                },
	                options: {
	                    scales: {
	                        yAxes: [{
	                            ticks: {
	                                max: 300,
	                                min: 0
	                            }
	                        }]
	                    },
	                    title: {
	                        display: true,
	                        text: 'Nutrient consumed over time versus Global Average'
	                    }
	                }
	            });
	    	});
		} else {
			var ctx = document.getElementById("trendsChart");
	            var trendsChart = new Chart(ctx, {
	                type: 'line',
	                data: {
	                    labels: _labels,
	                    datasets: _dataset
	                },
	                options: {
	                    scales: {
	                        yAxes: [{
	                            ticks: {
	                                max: 300,
	                                min: 0
	                            }
	                        }]
	                    },
	                    title: {
	                        display: true,
	                        text: 'Nutrient consumed over time versus Global Average'
	                    }
	                }
	            });
		}
    	});

    	this.setState({
    		renderGraph : true,
    	});
    },
	render: function(){
		return (
			<div>
				<form className="form-group row">
					<div className="col-md-4">
						<Select
						valueKey="ID"
						labelKey="NAME" 
						placeholder="Select Nutrient"
						clearable={false} 
						value={this.state.nutrientID}
						options={this.state.commonNutrients}
						onChange={this.handleNutrientChange} />
					</div>
					<div className="form-group row">
						<h5 className="col-md-1"> Start Date</h5>
						<div className="col-md-2">
							<Datetime dateFormat="MM-DD-YYYY" timeFormat={false} onChange={this.startDateChange}/> 
						</div>
						<h5 className="col-md-1"> End Date</h5>
						<div className="col-md-2">
							<Datetime  dateFormat="MM-DD-YYYY" timeFormat={false} onChange={this.endDateChange}/>
						</div>
						<Button className="btn-primary" onClick={this.renderChart}>Show Graph</Button>
					</div>
					
				</form>
				{ this.state.renderGraph?
				<div id="chartSize">
					<canvas id="trendsChart" width="45px" height="45px"></canvas>
                </div>
                :<div></div>
            	}
			</div>
		);
	}
});

//ReactDOM.render(<Search />, document.getElementById("search"));
export default Trends;

import React from 'react';
import {Button} from "react-bootstrap";
import Select from 'react-select';

const filterOpt = [{"label":"Between", "value":1}, {"label":"Equal to", "value":2}/*, {"label":"Max", "value":3}, {"label":"Min", "value":4}*/];

//const dbSource = "http://localhost/database.php?";
const dbSource = "http://www.cise.ufl.edu/~sedlabad/db.php?";

const Filter = React.createClass({
	minVal: -1, 
	maxVal: -1,
	nutrientsID: "203, 204, 205, 208, 269 ,291 ,301 ,303 ,304 ,305 ,306 ,307 ,309 ,317 ,318 ,324 ,401 ,404 ,405 ,406 ,415 ,418 ,430 ,431 ,601", //Common Nutrients
	propTypes: {
		nutrients:React.PropTypes.array,
	},
	componentWillMount: function(){
		var query = "select name as NAME, id as ID from nutrient where id in (" + this.nutrientsID + ")"; 
		//console.log(query);
		fetch(dbSource.concat(query))
		.then((response) => response.json())
		.then((json) => {
			this.setState({
				commonNutrients : json
			});
		});	
	},
	getInitialState: function(){
		return({
			value: 0,
			optVal:filterOpt[0],
			showMinValInput:true,
			showMaxValInput:true, 
			commonNutrients:[],
		});	
	},
	handleOptChange: function(newValue){
		var minIP = (newValue.value === 1 || newValue.value === 2)? true : false;
		var maxIP = (newValue.value === 1)? true:false
		if (!minIP) this.minVal = -1;
		if (!maxIP) this.maxVal = -1;
		this.setState({
			optVal: newValue,
			showMinValInput : minIP,
			showMaxValInput : maxIP,
		});
	},
	handleNutrientChange: function(newValue){
		this.setState({
			value : newValue,
		});
	},
	getFilter:function(){
		return ({
			"nutrient": parseInt(this.state.value.ID, 10),
			"option": parseInt(this.state.optVal.value, 10),
			"min": parseFloat(this.minVal),
			"max": parseFloat(this.maxVal),
		});
	},
	updateMaxInputValue : function(newValue){
		if (newValue !== undefined){
			this.maxVal = newValue.target.value;
		}
	},
	updateMinInputValue : function(newValue){
		if (newValue !== undefined){
			this.minVal = newValue.target.value;
		} 
	},
	render: function() {
        return (
	        <div className="form-group row">
	    		<div className="col-md-4">
	            	<Select
					valueKey="ID"
					labelKey="NAME" 
					placeholder="Select Nutrient"
					clearable={false} 
					value={this.state.value}
					options={this.state.commonNutrients}
					onChange={this.handleNutrientChange} />
				</div>
				<div className="col-md-4">
	            	<Select
					valueKey="value"
					labelKey="label"  
					clearable={false}
					value={this.state.optVal}
					options={filterOpt}
					onChange={this.handleOptChange} />
				</div>
				<div className="col-md-4">
					{this.state.showMinValInput ? (
					<div className="col-md-6">	
						<input type="text" className="form-control" placeholder="Val" onChange={this.updateMinInputValue}/>
					</div>) : <div></div>
					}
					{ this.state.showMaxValInput ? (
						<div className="col-md-6">
            				<input type="text" className="form-control" placeholder="Val" onChange={this.updateMaxInputValue}/>
	            		</div> ) : <div></div>
	            	}
            	
	        	</div>
	        </div>

        );
    }
});

const FilterComponent = React.createClass({
	getInitialState:function(){
		return {
			filterList:[],
		};
	},
	addFilter: function(){
		const filterList = this.state.filterList;
        this.setState({
            filterList : filterList.concat(<Filter key={filterList.length + 2}/>)
        });
	},
	getData: function(){
		var data = [];
		this.state.filterList.map(function(children, index){
			data.push(this.refs['filter-' + index].getFilter()); 
			return data;
		}, this);
		return data;
	},
	render : function(){
		return (
		  <div className="form-horizontal">
			  <div className="form-group">	
				{
					this.state.filterList.map(function(filter, index) {
						const compToRender = React.cloneElement(filter, {
				            ref: 'filter-' + index
				            }
				        )
                    	return <div key={index} className="col-md-12">{compToRender}</div>   
                	})
                }
              </div>
              <div>
		    	<Button bsStyle="default" onClick={this.addFilter}>Add Filter</Button>
		      </div>
		  </div>
		);
	}
});

module.exports = FilterComponent;
import React from 'react';
import {Button} from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Select from 'react-select';

//const dbSource = "http://localhost/database.php?";
const dbSource = "http://www.cise.ufl.edu/~sedlabad/db.php?";

var ServingSize = React.createClass({
  propTypes: {
      options: React.PropTypes.array,
      updateCB: React.PropTypes.func
    },
    getInitialState () {
    return {
      selectValue: 100,
      clearable:false
    };
  },
  handleSelectChange (newValue) {
    this.props.updateCB(newValue);
    this.setState({
      selectValue: newValue
    });
  },
  render () {
    return (
        <Select
        single
        simpleValue
        valueKey="GM" 
        labelKey="QUANTITY"
        clearable={this.state.clearable}
        value={this.state.selectValue}
        options={this.props.options}
        onChange={this.handleSelectChange} />
    );
  }
});

var NutrientDataModal = React.createClass({
  selectServingSize : 100,
  propTypes: {
      name: React.PropTypes.string,
      id: React.PropTypes.string, //may need to change type
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
  formQuery: function(){
    var query = `select q2.name, (q1.amount * `;
    query += this.selectServingSize;
    query +=`/ 100) || ' ' || q2.units as amount from(
            (select * from nutrition where food_id = `; 
    query += this.props.id;

    query += `) q1
              JOIN
              (select * from nutrient )q2
              on q1.nutrient_id = q2.id
            )`;

    //console.log (query);
    return query;
  },
  loadContent:function(){
    this.setState({
      data : []
    });
    var query = this.formQuery();
      fetch(dbSource.concat(query))
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          data : json
        });
      });
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
  open:function(){
    this.loadContent();
    this.loadServingSize();
    this.setState({
      showModal:true
    });
  },
  render: function () {
    return (
      <div>
        <Button
          bsStyle="default"
          onClick={this.open}>Show Nutrient Info
        </Button>
        <div className="modal fade">
          <Modal show={this.state.showModal} onHide={this.close}>
              <Modal.Header closeButton>
                <Modal.Title>Nutrient Content</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <h5 className="col-md-4">Serving Size </h5>
                  <div  className="col-md-6"><ServingSize updateCB={this.updateServingSize} options={this.state.servingSize}/></div>
                </div>
                <table>
                  <tbody>
                  {this.state.data.length > 0?
                  <tr>
                    <th> Nutrient </th>
                    <th> Amount </th>
                    
                  </tr>
                  :<tr>Loading...Please Wait!</tr>
                  }
                  {
                    this.state.data.map(function(item, key) {
                     return (
                        <tr key={key}>
                            <td>{item.NAME}</td>
                            <td>{item.AMOUNT}</td>
                        </tr>
                      ) 
                    })
                  }
                  </tbody>
                </table>
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={this.close}>Close</Button>
              </Modal.Footer>
            </Modal>
        </div>
      </div>
      )
  }
});

module.exports = NutrientDataModal;

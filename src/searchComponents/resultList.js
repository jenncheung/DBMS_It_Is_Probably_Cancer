import React from 'react';
import NutrientDataModal from "./nutrientDataModal"

const Result = React.createClass({
    propTypes: {
      name: React.PropTypes.string,
      desc: React.PropTypes.string,
      id: React.PropTypes.string,
      onBtnClick: React.PropTypes.func
    },
    btnOnClick: function(){
        this.props.onBtnClick(this.props.id, this.props.name);
    },
    render: function(){
      return (
            <tr>
              <td>{this.props.name}</td>
              <td>{this.props.desc}</td>
              <td>
                  <NutrientDataModal name={this.props.name} id={this.props.id}/>
              </td>
            </tr>
      );
    },
});


const ResultContainer = React.createClass({
  propTypes:{
    results: React.PropTypes.array
  },
  onResultClick: function(id, name){
      //console.log(id);
  },
  addRow: function (result) {
    return (<Result 
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
  render: function () {
    return (
      <div>
        <table className="table table-striped table-hover">
        { this.props.results.length > 0?
          <thead>
            <tr>
              <th><h3>Food</h3></th>
              <th><h3>Food Group</h3></th>
            </tr>
          </thead> 
          :<thead></thead>
        }
          <tbody>
          {this.createResultTable(this.props.results)}
          </tbody>
        </table>
      </div>
    );
  }
});
module.exports = ResultContainer;
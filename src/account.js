import React from 'react';
import ReactDOM from "react-dom";
import { Button } from "react-bootstrap";
import axios from 'axios';

var loginInfo = require('./navbar.js');

var AccountInfo = React.createClass({
    getInitialState() {
        this.tuples = "All Tuples: \n";
        this.numTuples = 0;



        if(loginInfo.globalLoggedIn) {
            var _this = this;
            axios
                .get("http://www.cise.ufl.edu/~cheung/dataConn.php?" + "select * from users where email='" + loginInfo.globalUserName + "' and password='" + loginInfo.globalPassword + "'")
                .then(function (result) {
                    if(result.data.length > 0) {
                        _this.setState({
                            showModal: false,
                            loggedIn: true,
                            loginFailed: false,
                            errorMessage: undefined
                        });
                    } else {
                            _this.setState({ loginFailed: true });
                    }
            });
        }
        return ({
            displayTuples: false
        });
    },
    displayAllTuples() {
        var _this = this;

        // TODO: All tables to display all tuples, add tables
        var jenn = "http://www.cise.ufl.edu/~cheung/dataConn.php?";
        var tableQueries = [jenn.concat("select * from users"), jenn.concat("select * from weight")];
        for (var table in tableQueries) {
            axios
                .get(tableQueries[table])
                .then(function (result) {

                    _this.tuples = _this.tuples.concat(JSON.stringify(result.data));
                    _this.numTuples = _this.numTuples + result.data.length;
                    _this.setState({
                        displayTuples : true
                    });
            });
        }
    },
    render() {
        var temp = loginInfo.globalLoggedIn;
        return (
            <div>
                {temp? (<div>LOGGED IN

                // Generate graph for weight over time period

                </div>) : (<div><Button onClick={this.displayAllTuples}>Display all tuples</Button></div>)}
                {this.state.displayTuples &&
                    <div>Total number of tuples: {this.numTuples} <hr></hr> {this.tuples} </div>
                }
            </div>
        );
    }
});

export default AccountInfo;

//create table weight
//(email                  varchar(50) not null,
// day                    date not null,
// weight                 numeric(5,2) not null,
// primary key(email, day)
//);

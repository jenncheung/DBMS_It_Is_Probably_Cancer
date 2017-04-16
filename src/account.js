import React from 'react';
import ReactDOM from "react-dom";
import { Button } from "react-bootstrap";
import axios from 'axios';

var loginInfo = require('./navbar.js');
var Chart = require('chart.js');

var jenn = "http://www.cise.ufl.edu/~cheung/dataConn.php?";
var sachin  = "http://www.cise.ufl.edu/~sedlabad/db.php?";

var AccountInfo = React.createClass({
    getInitialState() {
        this.numTuples = 0;
        var _dataset = [];


        // Get average weights of the days the user has recorded for the same gender
        axios
            .get(jenn + "select day, avg(weight) as weight from weight" +
                " where day in (select day from weight where email='" + loginInfo.globalUserName + "') and "
                + " email in (select email from users where gender=(select gender from users where email='" + loginInfo.globalUserName
                + "')) group by day order by day")
            .then(function (result) {
                var _data = [];

                for(var tuple in result.data) {
                    _data.push(result.data[tuple].WEIGHT);
                }

                _dataset.push({
                    label: 'Average Weight',
                    data: _data,
                    backgroundColor: [
                        'rgba(255, 199, 152, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255,199,152,1)',
                    ],
                    borderWidth: 1
                });
        });

        if(loginInfo.globalLoggedIn) {
            var _this = this;
            axios
                .get(jenn + "select * from users where email='" + loginInfo.globalUserName + "' and password='" + loginInfo.globalPassword + "'")
                .then(function (result) {
                    if(result.data.length > 0) {
                        _this.setState({
                            showModal: false,
                            loggedIn: true,
                            loginFailed: false,
                            errorMessage: undefined,
                            name: result.data[0].FIRST_NAME,
                            email: result.data[0].EMAIL,
                            gender: result.data[0].GENDER,
                            dob: result.data[0].DATE_OF_BIRTH
                        });

                        // generate a graph of the user's logged weight
                        axios
                        .get(jenn + "select weight, day from weight where email='" + loginInfo.globalUserName + "' order by day")
                        .then(function (result) {
                            var _labels = [];
                            var _data = [];

                            for(var tuple in result.data) {
                                _labels.push(result.data[tuple].DAY);
                                _data.push(result.data[tuple].WEIGHT);
                            }

                            _dataset.push({
                                label: 'Your Weight',
                                data: _data,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(255,99,132,1)',
                                ],
                                borderWidth: 1
                            });

                            var ctx = document.getElementById("accountChart");
                            var accountChart = new Chart(ctx, {
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
                                                min: 50
                                            }
                                        }]
                                    },
                                    title: {
                                        display: true,
                                        text: 'Your weight versus Your Gender\'s Average'
                                    }
                                }
                            });
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
        var tableQueries = [jenn.concat("select count(*) as count from users"), jenn.concat("select count(*) as count from weight"),
                            sachin.concat("select count(*) as count from food"), sachin.concat("select count(*) as count from food_group"),
                            sachin.concat("select count(*) as count from health_conditions"),
                            sachin.concat("select count(*) as count from nutrient"),
                            sachin.concat("select count(*) as count from nutrition"), sachin.concat("select count(*) as count from weight")];
        for (var table in tableQueries) {
            axios
                .get(tableQueries[table])
                .then(function (result) {
                    _this.numTuples = _this.numTuples + parseInt(result.data[0].COUNT);
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
            {temp?
                (<div>
                    <h4> Name: {this.state.name} </h4>
                    <h5> Email: {this.state.email} </h5>
                    <h5> Date of Birth: {this.state.dob} </h5>
                    <h5> Gender: {this.state.gender}</h5>
                    <h5> Weight over time </h5>
                    <div id="chartSize">
                        <canvas id="accountChart" width="45px" height="45px"></canvas>
                    </div>
                </div>) : (<div><Button onClick={this.displayAllTuples}>Display all tuples</Button></div>)}
                {this.state.displayTuples &&
                    <div>
                    Total number of tuples: {this.numTuples}
                    </div>
                }
            </div>
        );
    }
});

export default AccountInfo;

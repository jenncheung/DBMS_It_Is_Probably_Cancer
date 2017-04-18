import React from 'react';
import ReactDOM from "react-dom";
import { Button } from "react-bootstrap";
import { RadioGroup, Radio } from 'react-radio-group';
import axios from 'axios';

var loginInfo = require('./navbar.js');
var Chart = require('chart.js');

var jenn = "http://www.cise.ufl.edu/~cheung/dataConn.php?";
var sachin  = "http://www.cise.ufl.edu/~sedlabad/db.php?";


var pastDays = "7";
var queryGender = 'f';
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
                            _this.setState({
                                queryGender : 'f',
                                pastDays: "7"
                            });
                            _this.makeLoginAverageChart();
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
    changeGender(gender) {
        queryGender = gender;
        // For button image change
        this.setState({ queryGender: gender });
        this.makeLoginAverageChart();
    },
    changeTimePeriod(time) {
        pastDays = time;
        this.setState({ pastDays: time });
        this.makeLoginAverageChart();
    },
    makeLoginAverageChart() {
        var _this = this;
        // Format date for query
        var day = new Date();
        day = new Date(day.getTime() - (pastDays * 24 * 60 * 60 * 1000))
        var dd = day.getDate();
        var mm = day.getMonth()+1; //January is 0!

        var yyyy = day.getFullYear();
        if(dd<10){
            dd='0'+dd;
        }
        if(mm<10){
            mm='0'+mm;
        }
        day = dd+'/'+mm+'/'+yyyy;

        // Get number of logins by gender
        axios
            .get(jenn + "select day, count(*) as count from weight where email in (select email from users where gender='" + queryGender + "')" +
                " and day > TO_DATE('"+ day + "','DD/MM/YYYY') group by day order by day")
            .then(function (result) {
                var numLogins = [];
                var dates = [];

                for(var tuple in result.data) {
                    numLogins.push(result.data[tuple].COUNT);
                    dates.push(result.data[tuple].DAY)
                }

                var ctx = document.getElementById("loginChart");
                var accountChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'number of logins',
                            data: numLogins,
                            backgroundColor: [
                                  'rgba(255, 199, 152, 0.2)',
                            ],
                            borderColor: [
                                  'rgba(255,199,152,1)',
                             ],
                             borderWidth: 1
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Average Number of Logins'
                        }
                    }
                });
            });
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
                    <div id="chartSize">
                        <canvas id="loginChart" width="45px" height="45px"></canvas>
                        <RadioGroup name="gender" selectedValue={this.state.queryGender} onChange={this.changeGender}>
                            <Radio value="f" />Female
                            <Radio value="m" />Male
                        </RadioGroup>
                        <RadioGroup name="days" selectedValue={this.state.pastDays} onChange={this.changeTimePeriod} id="bottomRadio">
                            <Radio value="7" />Week
                            <Radio value="30" />Month
                            <Radio value="365" /> Year
                        </RadioGroup>
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

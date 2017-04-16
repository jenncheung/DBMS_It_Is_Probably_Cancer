import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import navbar from './navbar';
var ReactRouter = require('react-router');
import {Jumbotron, Button} from 'react-bootstrap'


var FoodLog = React.createClass({
	render: function() {
		//alert('in foodlog');
		return(
			<div>
				<Jumbotron className="not-logged-in">
					<h1>Hello there!</h1>
					<p>You must be logged in to access personal food log.</p>
					<p><Button bsStyle="primary">Login/Signup</Button></p>
				</Jumbotron>
			</div>
		);
	}
});

module.exports = FoodLog;
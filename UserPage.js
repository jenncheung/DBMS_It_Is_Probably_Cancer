import React from 'react';
import ReactDOM from "react-dom";
import axios from 'axios';

// Import navbar features
import { Navbar, MenuItem, NavDropdown } from "react-bootstrap";


import { Nav } from "react-bootstrap";
import { NavItem } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { RadioGroup, Radio } from 'react-radio-group';
import { Link, browserHistory } from 'react-router';

var globalUserName;
var globalLoggedIn;
var globalPassword;

var Router = require('react-router');
var account = require('./account.js');

const navbarInstance = (
    <Navbar inverse collapseOnSelect>
    <Navbar.Header>
        <Navbar.Brand>
        <a href="#" id="siteName">Is It Cancer? ... Probably</a>
    </Navbar.Brand>
    <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
        <Nav>
            <NavItem eventKey={1} href="#">Foods</NavItem>
            <NavItem eventKey={2} href="#">Log</NavItem>
        </Nav>
    <Nav pullRight>
       <NavDropdown eventKey="3" title="USER ACCOUNT" id="nav-dropdown">
        <MenuItem divider />
          <MenuItem eventKey="3.1">USER DETAILS</MenuItem>
           <MenuItem divider />
          <MenuItem eventKey="3.2">HEALTH CONDITIONS</MenuItem>
           <MenuItem divider />
          <MenuItem eventKey="3.3">DIET PLAN</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="3.4">LOGOUT</MenuItem>
        </NavDropdown>
    </Nav>
    </Navbar.Collapse>
</Navbar>

);

ReactDOM.render(navbarInstance, document.getElementById("staticNavbar"));

export default Navbar;

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
import { Route, RouteHandler, Link, browserHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { routes } from './App'

var globalUserName;
var globalLoggedIn;
var globalPassword;

var Router = require('react-router');
var account = require('./account.js');
var foods = require('./search.js');

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
			<LinkContainer to="/log">
				<NavItem eventKey={2} href="#">Log</NavItem>
			</LinkContainer>
        </Nav>
    <Nav pullRight>
        <NavItem id="loginNav"></NavItem>
    </Nav>
    </Navbar.Collapse>
</Navbar>
);


// Modal for Login
const Login = React.createClass({
    getInitialState() {
        return {
            showModal: false,
            loggedIn: false,
            loginFailed: false,
            signUp: false,
            signInError: false,
            userName: "500@test.com",
            password: "testpass",
            first_name: "",
            gender: "",
            dob: "",
            weight: ""
        };
    },
    close() {
        this.setState({ showModal: false });
    },
    open() {
        this.setState({ showModal: true });
    },
    handleInputChange(event) {
        // TODO: clean up even handling for radio button groups, since they're not passed in as other event formats
        const target = typeof event.target === 'undefined' ? this : event.target ;
        const value = typeof event.target === 'undefined'  ? event : target.value;
        const name = typeof event.target === 'undefined' ? "gender" : target.name;

        this.setState({ [name]: value });
    },
    checkCredentials() {
        // Put the Credentials verification here
        var _this = this;
        axios
            .get("http://www.cise.ufl.edu/~cheung/dataConn.php?" + "select * from users where email='" + this.state.userName + "' and password='" + this.state.password + "'")
            .then(function (result) {
                if(result.data.length > 0) {
                    _this.setState({
                        showModal: false,
                        loggedIn: true,
                        loginFailed: false,
                        errorMessage: undefined
                    });
                    globalUserName = _this.state.userName;
                    globalLoggedIn = _this.state.loggedIn;
                    globalPassword = _this.state.password;

                    // Redirects to landing page
                    Router.browserHistory.push('/');
                } else {
                        _this.setState({ loginFailed: true });
                }
        });
    },
    signUp() {
        this.setState({ signUp: !this.state.signUp });
    },
    goToAccounts() {
        Router.browserHistory.push('/account');
    },
    goToFoods() {
        Router.browserHistory.push('/foods');
    },
    submitSignUp() {
        var _this = this;
            axios
                .get("http://www.cise.ufl.edu/~cheung/dataConn.php?" + "insert into users(email, first_name, password, date_of_birth, gender, weight) " +
                    "values(" +
                        "'" + this.state.userName + "'," +
                        "'" + this.state.first_name + "'," +
                        "'" + this.state.password + "'," +
                        "TO_DATE('" + this.state.dob + "','YYYY-MM-DD')," +
                        "'" + this.state.gender + "'," +
                        "'" + this.state.weight + "')")
                .then(function (result) {
                    if(result.data.includes("<pre>"))
                    {
                        _this.setState({
                            signInError: true,
                            errorMessage: result.data
                        });
                    } else {
                        _this.setState({
                             signInError: false,
                             loggedIn: true,
                             showModal: false
                        });
                        globalUserName = _this.state.userName;
                        globalLoggedIn = _this.state.loggedIn;
                        globalPassword = _this.state.password;
                        Router.browserHistory.push('/');
                     }
                }).catch(function (error) {
                    console.log(error);
                    _this.setState({
                        signInError: true,
                        errorMessage: error.message
                    });
                });
    },
    logOut() {
        this.setState({ loggedIn: false });
        Router.browserHistory.push('/');
    },
    render() {
        return (
            <div>
                {this.state.loggedIn?  (
                    <div id="navbarPad">
                         <NavDropdown eventKey={3} title={this.state.userName} id="basic-nav-dropdown" noCaret>
                                <MenuItem eventKey={3.1}>
                                    <Button
                                        id="dropdownButton"
                                        onClick={this.goToAccounts}>Account
                                    </Button></MenuItem>
                                <MenuItem eventKey={3.2}>Log</MenuItem>
                                <MenuItem eventKey={3.3}>
                                    <Button
                                        id="dropdownButton"
                                        onClick={this.goToFoods}>Foods
                                    </Button></MenuItem>
                                <MenuItem divider />
                                <MenuItem eventKey={3.4}>
                                    <Button
                                        bsStyle="primary"
                                        onClick={this.logOut}>Log Out
                                    </Button>
                                </MenuItem>
                      </NavDropdown>
                    </div>
                    ) : (
                        <Button
                            bsStyle="primary"
                            onClick={this.open}>Login/Sign up
                        </Button>
                    )
                }
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                    <Modal.Title>Welcome to Is It Cancer!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {this.state.signUp?
                    (<div>
                        <form>
                            <h5>Email</h5>
                            <input
                                name="userName"
                                type="string"
                                className="wideInput"
                                placeholder="email address"
                                value={this.state.userName}
                                onChange={this.handleInputChange} />
                            <br />
                            <h5>Password</h5>
                            <input
                                name="password"
                                type="password"
                                className="wideInput"
                                placeholder="password"
                                value={this.state.password}
                                onChange={this.handleInputChange} />
                            <br />
                            <h5>First Name</h5>
                            <input
                                name="first_name"
                                type="string"
                                className="wideInput"
                                placeholder="First Name"
                                value={this.state.name}
                                onChange={this.handleInputChange} />
                            <br />
                            <h5>Date of Birth</h5>
                            <input
                                name="dob"
                                type="date"
                                className="wideInput"
                                value={this.state.dob}
                                onChange={this.handleInputChange} />
                            <h5>Gender</h5>
                            <RadioGroup name="gender" selectedValue={this.state.gender} onChange={this.handleInputChange}>
                                <Radio value="F" />Female
                                <Radio value="M" />Male
                            </RadioGroup>
                            <h5>Weight</h5>
                            <input
                                name="weight"
                                type="string"
                                className="wideInput"
                                value={this.state.weight}
                                onChange={this.handleInputChange} />
                        </form>
                        <Button id="pullRightButton"
                            bsStyle="primary"
                            type="submit"
                            onClick={this.submitSignUp}> SignUp
                        </Button>
                        { this.state.signInError &&
                            <h4 id="failureMessage"> Sign up failed, please check your fields and try again: {this.state.errorMessage} </h4>
                        }

                        <br/>
                        <Button id="largeButtonWidth"
                            bsStyle="info"
                            onClick={this.signUp}> Go Back to Login
                        </Button>
                    </div>) : (
                <div>
                <h3>Login</h3>
                    <form>
                        <h5>Email</h5>
                        <input
                            name="userName"
                            type="string"
                            className="wideInput"
                            placeholder="email address"
                            value={this.state.userName}
                            onChange={this.handleInputChange} />
                        <br />
                        <h5>Password</h5>
                        <input
                            name="password"
                            type="password"
                            className="wideInput"
                            placeholder="password"
                            value={this.state.password}
                            onChange={this.handleInputChange} />

                        {this.state.loginFailed === true &&
                             <h4 id="failureMessage"> Login Failed, please try again</h4>
                        }
                        <br />
                        <Button id="pullRightButton"
                            bsStyle="primary"
                            onClick={this.checkCredentials}> Login
                        </Button>
                    </form>
                    <br />
                    <hr />
                    <h3>Don't have account?</h3>
                    <br />
                    <Button id="largeButtonWidth"
                        bsStyle="info"
                        bsSize="large"
                        onClick={this.signUp}> Sign up
                    </Button>
                    </div>)}
                    </Modal.Body>
                    <br />
                    <br />
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
});

ReactDOM.render(navbarInstance, document.getElementById("staticNavbar"));
ReactDOM.render(<Login />, document.getElementById("loginNav"));

module.export = { globalUserName, globalLoggedIn, globalPassword};
export default Navbar;
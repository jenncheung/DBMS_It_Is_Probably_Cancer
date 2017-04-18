import React, { Component } from 'react';
import './App.css';
import AccountInfo from './account';
import Search from './search';
import ReactDOM from 'react-dom';
import { Route, browserHistory, Router, IndexRoute } from 'react-router';
import FoodLog from './FoodLog'
import FoodLog2 from './FoodLog2'
import Trends from './trends'
import LandingPage from './landingPage';

class App extends Component {
  render() {
    return (
		routes
    )
  }
}
const Home = () => <h1>LANDING PAGE</h1>;

const routes = (
	<Router history={browserHistory}>
		<Route path='/' component={LandingPage} />
		<Route path='/account' component={AccountInfo} />
		<Route path='/foods' component={Search} />
		<Route path='/log' component={FoodLog} />
		<Route path='/log2' component={FoodLog2} />
		<Route path='/trends' component={Trends} />
	</Router>
);

module.export = routes;
export default App;

//
//ReactDOM.render((
//   <Router history = {browserHistory}>
//
//   <Route path="/" component={App}>
//
//         {/* add it here, as a child of `/` */}
//
//         <Route path="/account" component={AccountPage}/>
//       </Route>
//   </Router>
//
//), document.getElementById('root'));

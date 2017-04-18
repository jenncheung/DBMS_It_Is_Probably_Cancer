import React, { Component } from 'react';
import {React_Bootstrap_Carousel} from 'react-bootstrap-carousel';

class LandingPage extends React.Component {
    onSelect= (active,direction)=>{
        console.log(`active=${active} && direction=${direction}`);
    }
    render() {
      return(
        <div style={{height:300,margin:20}}>
          <React_Bootstrap_Carousel
            animation={true}
            onSelect={this.onSelect}
            className="carousel-fade"
          >
            <div >
              <img style={{height:600,width:"100%"}} src="http://www-t.decisionnewsmedia.com/res/img/20131211-17.10.22-99/FM_Health_and_nutrition_infographic.jpg"/>
            </div> 
            <div >
              <img style={{height:600,width:"100%"}} src="http://www.mysticmedicine.com/wp-content/uploads/2016/04/HD-Fitness-Nutrition.jpg"/>
            </div> 
            <div >
              <img style={{height:600,width:"100%"}} src="http://healthyfoodscience.com/wp-content/uploads/2014/06/14-anti-cancer-foods.jpg"/>
            </div> 
            <div >
              <img style={{height:600,width:"100%"}} src="https://www.fit4lifeindia.com/wp-content/uploads/2015/09/fit-for-life-food.png"/>
            </div> 
            
            <div style={{height:300,width:"100%",backgroundColor:"lightpink"}}>
             
            </div>
          </React_Bootstrap_Carousel>
        </div>
      )
    }
};
module.exports = LandingPage;
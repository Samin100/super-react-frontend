import React, { Component } from 'react';
import '../signup.css';
import logo_black from '../static/images/logos/super-logo-black.png';
import { Link } from 'react-router-dom'




export default function SignupBase(props) {
  // a base div used in all authentication pages
  // the right column must be passed in as the prop `RightCol`
  // this component should NEVER be rendered alone
  return (
    <div className="signup-wrapper">
      <div className="signup-container">
      <div className="signup-left-col">
      <Link to="/"><img src={logo_black} alt="super" className="signup-logo" /></Link>
      <hr className="signup-hr"/>
      <p className="signup-testimonial">
        Super lets me build any self-improvement system in just a few minutes.
        It's changed the trajectory of my life.
      </p>
      <p className="signup-testimonial-name">Alexander Hamilton</p>
      <p className="signup-testimonial-title">United States Founding Father</p>
      </div>
      {props.RightCol}
      </div>
    </div>
  )
}

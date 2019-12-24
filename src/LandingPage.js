import React, { Component } from 'react';
import './Landing.css';
import { Link } from 'react-router-dom'


import logo_black from './static/images/logos/super-logo-black.png';
import laptop from './static/images/laptop.png';


function Header() {
  return (
    <div className="landing-header">
      <Link to="/"><img className="header-logo" src={logo_black} alt="super" /></Link>

      <div className="landing-header-right">
        <Link to="/signup">
        <button className="generic-button">
          Try Now
        </button>
        </Link>
      </div>
    </div>
  )
}


class LandingPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    console.log(this.props)

    return (
      <div className="landing-wrapper">
        <Header />

        <div>
          <h1 className="landing-tagline">Maximize your human potential.</h1>
          <h2 className="landing-tagline-small">
          Super tracks all your goals and habits in one place.
          </h2>
          {/* <h2 className="landing-tagline-small">
        You have lots of goals.
          <br/>
          You need a system. That system is Super.
          </h2> */}

          <div className="text-center">
          <Link to="/signup">
          <button className="generic-button wide-button">
            Sign up for free
          </button>
          </Link>
          <p className="landing-p">Already using Super? <Link to="/login">Sign in.</Link></p>
          </div>

          <img src={laptop} alt="" className="landing-screenshot"/>
          <div className="landing-image-container">

          </div>

          <div className="landing-footer">
            <img className="header-logo footer-logo" src={logo_black} alt="super" />

            <div className="landing-footer-content-container">
              <h3 className="footer-header">RESOURCES</h3>
              <p><Link className="footer-link" to="/privacy">Privacy Policy</Link></p>
              <p><Link className="footer-link" to="/terms">Terms of Service</Link></p>
            </div>
          </div>

        </div>
      </div>
    )
  }

}


export default LandingPage;

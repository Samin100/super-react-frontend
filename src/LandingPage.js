import React, { Component } from 'react';
import './Landing.css';
import { Link } from 'react-router-dom'


import logo_black from './static/images/logos/super-logo-black.png';
import laptop from './static/images/laptop.png';

import apple from './static/images/companies/apple_logo.svg'
import stripe from './static/images/companies/stripe_logo.svg'
import google from './static/images/companies/google_logo.svg'
import yc from './static/images/companies/yc_logo.svg'
import nasa from './static/images/companies/nasa_logo.svg'
import spacex from './static/images/companies/spacex_logo.svg'
import super_screenshot from './static/images/super-screenshot.png'

import iphone_imessage from './static/images/iphone.png'


function Header() {
  return (
    <div className="">
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


  render() {

    const CompanyLogos = [google, yc, spacex, stripe].map((logo, index) => {
      return <img
        className={logo.includes('/nasa_logo') ? 'landing-logo nasa-logo' : 'landing-logo'}
        alt=""
        src={logo}
        key={index}
      />
    })

    return (
      <div className="landing-container">
        <Header />

        <div>
          <h1 className="landing-tagline">
            Life tracking made effortless.
            </h1>
          <h2 className="landing-tagline-small">
            Improving your life starts with one simple step: tracking the right metrics.
            Super makes it easy to track any metric you want.
              </h2>
          {/* <h2 className="landing-tagline-small">
            Track anything by replying to a text. <br />
            Understand your progress with a dashboard. <br />
            Quantify your own self-improvement.
          </h2> */}
          <div className="text-center">
            <Link to="/signup">
              <button className="generic-button wide-button cta-btn">
                Try Now
          </button>
            </Link>
            <p className="landing-p">Already using Super? <Link to="/login">Sign in.</Link></p>
          </div>

          <img src={super_screenshot} alt="" className="landing-screenshot" />

          <h2 className="landing-subheader">Join top professionals at these companies using Super.</h2>
          <div className="landing-logos-container">
            {CompanyLogos}
          </div>

          <div className="landing-section">
            <img className="landing-iphone" alt="" src={iphone_imessage} />
            <div className="landing-left-text-wrapper">
              <h1 className="landing-section-title margin-top-20">Just reply to a text.</h1>
              <p className="landing-subtext">
                Set up any personal metric you care about, and just reply to a text
                to update it. No more dealing with messy spreadsheets.
              </p>
              <h1 className="landing-section-title">Sync from other apps.</h1>
              <p className="landing-subtext">
                Sync your metrics from other apps to Super.
                Integrations include MyFitnessPal,
                Fitbit, Zapier, and more.
                <br />
                <Link to="/signup">See all integrations.</Link>
              </p>
              <h1 className="landing-section-title">Visualize your progress.</h1>
              <p className="landing-subtext">
                Get a shareable dashboard that displays your progress.
                You'll also get a personal report every week explaining how well you're doing.

              </p>
            </div>

          </div>


          <div className="text-center margin-top-50">
            <h1 className="landing-section-title">Get started with Super in seconds.</h1>
            <Link to="/signup">
              <button className="generic-button wide-button cta-btn">
                Try Now
          </button>
            </Link>
            <p className="landing-p">Already using Super? <Link to="/login">Sign in.</Link></p>
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
      </div >
    )
  }

}


export default LandingPage;

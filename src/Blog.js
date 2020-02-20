import React, { Component } from 'react';
import './Landing.css';
import { Link } from 'react-router-dom'


import logo_black from './static/images/logos/super-logo-black.png';
import logo_white from './static/images/logos/super-logo-white.png';
import laptop from './static/images/laptop.png';

import apple from './static/images/companies/apple_logo.svg'
import stripe from './static/images/companies/stripe_logo.svg'
import google from './static/images/companies/google_logo.svg'
import yc from './static/images/companies/yc_logo.svg'
import nasa from './static/images/companies/nasa_logo.svg'
import spacex from './static/images/companies/spacex_logo.svg'
import super_screenshot from './static/images/super-screenshot.png'

import iphone_imessage from './static/images/iphone.png'
import axios from 'axios'
import GhostContentAPI from '@tryghost/content-api'
import spinner_black from './spinner_black.svg'
import { moment } from 'moment'
function Header() {
  return (
    <div className="">
      <Link to="/"><img className="header-logo" src={logo_white} alt="super" /></Link>

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


class Blog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      posts: null
    }

    this.ghost = new GhostContentAPI({
      url: 'https://sharif.io',
      key: 'c98f5b1de584963379aff9b98f',
      version: "v3"
    });

  }

  componentDidMount() {

    this.ghost.posts.browse({ tag: 'super', include: 'tags,authors', }).then(posts => {
      console.log(posts)
      let super_posts = []
      posts.map((post, index) => {
        if (post.tags.length && post.tags[0].name === 'super') {
          super_posts.push(post)
        }
      })
      console.log(super_posts)
      this.setState({ posts: super_posts })
      console.log(posts)
    }).catch(err => {
      console.log(err)
    })

  }


  render() {

    let Posts = null;
    if (this.state.posts === null) {
      Posts = (
        <div className="login-status-spinner-container">
          <img className="login-status-spinner" src={spinner_black} alt="Loading..." />
        </div>
      )
    } else {
      Posts = this.state.posts.map((post, index) => {
        if (!post.feature_image) {
          return null
        }
        return (
          <div
            key={index}
            className="blog-post-box">
            <div>
              <a href={`/blog/${post.slug}`}>
                <img
                  className="blog-box-img"
                  src={post.feature_image} alt="" />
              </a>
            </div>
            <a href={`/blog/${post.slug}`}>
              <h3 className="white-txt">{post.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: post.excerpt }} className="post-excerpt white-txt"></div>
            </a>
          </div >

        )
      })
    }

    return (
      <div className="dark-bg" >
        <div className="landing-container">

          <Header />
          <h1 className="blog-title white-txt">
            Tools for maximizing your human potential.
        </h1>

          <div>
            <div style={{ '--animation-order': '0' }} className="blog-container landing-animate">
              {Posts}
            </div>
            <div className="landing-footer blog-footer">
              <img className="header-logo footer-logo" src={logo_white} alt="super" />

              <div className="landing-footer-content-container ">
                <h3 className="footer-header white-txt">RESOURCES</h3>
                <p><Link className="footer-link white-txt" to="/privacy">Privacy Policy</Link></p>
                <p><Link className="footer-link white-txt" to="/terms">Terms of Service</Link></p>
              </div>
            </div>
          </div>
        </div >
      </div>
    )
  }

}


export default Blog;

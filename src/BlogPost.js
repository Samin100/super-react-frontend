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
import moment from 'moment'

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


class BlogPost extends Component {

  constructor(props) {
    super(props)
    this.state = {
      post: null,
      slug: props.match.params.slug
    }

    this.ghost = new GhostContentAPI({
      url: 'https://sharif.io',
      key: 'c98f5b1de584963379aff9b98f',
      version: "v3"
    });

  }

  componentDidMount() {

    this.ghost.posts.read({ slug: this.state.slug, include: 'tags,authors' }).then(post => {
      this.setState({ post: post })
      console.log(post)
    }).catch(err => {
      console.log(err)
    })

  }


  render() {


    if (this.state.post === null) {
      return (
        <div className="login-status-spinner-container">
          <img className="login-status-spinner" src={spinner_black} alt="Loading..." />
        </div>
      )
    }



    return (
      <div className="dark-bg" >
        <div className="landing-container">

          <Header />

          <div className="blog-post-container">
            <h3 className="align-center back-to-blog-top white-txt"><a className="white-txt back-to-blog" href="/blog">&lt; Back to posts</a></h3>
            <h1 className="blog-post-title white-txt">
              {this.state.post ? this.state.post.title : null}
            </h1>

            <p className="blog-post-author white-txt">Published by {this.state.post.primary_author.name}</p>
            <p className="blog-post-author white-txt blog-post-date">{moment(this.state.post.created_at).format('MMMM Do YYYY')}</p>

            <div>
              <div style={{ '--animation-order': '0' }} className="blog-container landing-animate">
                <div className=" blog-post-body white-txt" dangerouslySetInnerHTML={{ __html: this.state.post.html }}>
                </div>
              </div>
              <h3 className="align-center white-txt"><a className="white-txt back-to-blog" href="/blog">&lt; Back to posts</a></h3>

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


export default BlogPost;

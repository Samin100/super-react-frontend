import React, { Component } from 'react';
import not_found_img from './static/images/fogg/fogg-page-not-found-1.png'
import { Link } from 'react-router-dom';

class NotFound404 extends Component {

  render() {
    return (
      <div className="not-found-container">
        <img className="not-found-img" src={not_found_img} alt=""/>
        <h1 className="h1-404-title">That's odd...</h1>
        <p>This page appears to be missing.</p>
          <p><Link className="go-home-404" to="/"><strong>Go home</strong></Link></p>
      </div>
    )
  }
}

export default NotFound404;

import React, { Component } from 'react';
import logo_black from '../static/images/logos/super-logo-black.png';

import home from '../static/images/home.svg';
import add from '../static/images/add-icon.svg';
import settings from '../static/images/settings.svg';
import list from '../static/images/list.svg';
import { connect, Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import megaphone from '../static/images/megaphone.svg'
import spinner from '../static/images/spinner.svg';
import { API_URL } from '../index.js';
import axios from 'axios'

class LeftColumn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_menu: false,
            page: props.page ? props.page : "",
            welcome_greeting: props.user.first_name ? `${props.user.first_name} ${props.user.last_name}` : "Welcome!",
            user_img: props.user.picture_url,
            show_feedback_input: false,
            show_feedback_done: false,
            feedback_value: "",
            submitting_feedback: false
        }

        // an array containing the pages to be rendered in the left column
        this.pages = [
            {
                name: "Home",
                link: "/",
                icon: home,
                term: "home"
            },
            {
                name: "Create an Item",
                link: "/create",
                icon: add,
                term: "create"
            },
            {
                name: "Manage Items",
                link: "/items",
                icon: list,
                term: "manage"
            },
            {
                name: "Integrations",
                link: "/integrations",
                icon: settings,
                term: "integrations"
            },

        ]

        this.onMenuClick = this.onMenuClick.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.LeftColWide = this.LeftColWide.bind(this);
        this.onFeedbackClick = this.onFeedbackClick.bind(this);
        this.onFeedbackChange = this.onFeedbackChange.bind(this);
        this.onFeedbackSubmit = this.onFeedbackSubmit.bind(this)

    }

    onFeedbackSubmit(e) {
        // when a user presses the submit feedback button
        if (this.state.submitting_feedback) {
            return
        }
        this.setState({ submitting_feedback: true })

        // we get the feedback and submit it.
        const data = { feedback: this.state.feedback_value, url: window.location.href }
        axios.post(`${API_URL}/api/support/handle-feedback/`, data).then(response => {
            this.setState({
                submitting_feedback: false,
                feedback_value: "",
                show_feedback_done: true,
                show_feedback_input: false
            })
        }).catch(error => {
            this.setState({ submitting_feedback: false, })
        })
    }


    onFeedbackChange(e) {
        this.setState({ feedback_value: e.target.value })
    }

    onFeedbackClick(e) {
        this.setState({ show_feedback_input: true });
    }

    onMenuClick(e) {
        this.setState({ show_menu: !this.state.show_menu });
    }
    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(e) {
        if (this.wrapperRef && !this.wrapperRef.contains(e.target) && e.target.id !== "menugreeting") {
            console.log(e.target.id)
            this.setState({ show_menu: false });
        }

        console.log(e.target.id)
        if (e.target.id !== "feedback-box") {

            this.setState({ show_feedback_input: false, show_feedback_done: false })
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    LeftColWide() {
        const Pages = this.pages.map((page, index) => {
            // checking if this is the active page
            // and styling the div accordingly
            let CSS = "left-col-menu-item"
            if (page.term.toLowerCase() === this.state.page.toLowerCase()) {
                CSS = "left-col-menu-item left-col-menu-active"
            }
            return (
                <Link key={index} to={page.link}>
                    <div className={CSS}>
                        <img alt="" src={page.icon} className="left-col-icon" />
                        <p className="left-menu-item">{page.name}
                        </p>
                    </div>
                </Link>
            )
        })

        let Menu = null;

        if (this.state.show_menu) {
            Menu = (
                <div id="menugreeting" ref={this.setWrapperRef} className="left-col-toggle-menu">
                    <Link to="/logout">
                        <p id="menugreeting" className="leftcol-toggle-item">Sign out</p>
                    </Link>
                </div>
            )
        }

        let UserImg = null;
        if (this.state.user_img) {
            UserImg = (
                <img id="menugreeting" alt="" className="leftcol-user-img" src={this.state.user_img}></img>
            )
        }

        let Dashboards = null;
        if (this.props.dashboards) {
            Dashboards = this.props.dashboards.map((dashboard, index) => {
                return (
                    <Link key={index} to={`/dashboard/${dashboard.key}/`}>
                        <p className="leftcol-dashboard-item leftcol-dash-name">
                            {dashboard.emoji} {dashboard.name}
                        </p>
                    </Link>
                )
            })
        }

        let FeedbackInput = null;
        if (this.state.show_feedback_input) {
            FeedbackInput = (
                <div id="feedback-box" className="feedback-input">
                    <textarea
                        id="feedback-box"
                        placeholder="Feedback about this page?"
                        autoFocus
                        onChange={this.onFeedbackChange}
                        value={this.state.feedback_value}
                        className="input feedback-textarea"></textarea>
                    <div id="feedback-box" className="button-pair">

                        <button className="button edit-item-button archive-button create-v-button feedback-cancel-btn">Cancel</button>
                        {this.state.submitting_feedback ?
                            <button id="feedback-box" className="button edit-item-button archive-button create-v-button feedback-submit-btn spinner-btn"><img id="feedback-box" className="spinner spinner-small" src={spinner} alt=""></img></button>
                            :
                            <button
                                onClick={this.onFeedbackSubmit}
                                id="feedback-box"
                                className="button edit-item-button archive-button create-v-button feedback-submit-btn">
                                Submit
                                </button>
                        }

                    </div>
                </div>
            )
        } else if (this.state.show_feedback_done) {
            FeedbackInput = (
                <div id="feedback-box" className="feedback-input">

                    <img className="feedback-svg" src={megaphone} alt="" />
                    <p className="feedback-thanks">Thanks</p>
                    <p className="feedback-thanks-2">We really appreciate your feedback!</p>
                    <p className="feedback-thanks-3">The Super engineering team</p>
                </div>
            )
        }

        return (
            <div className={this.props.hidden ? "Left hide-left-col" : "Left"}>


                <div className="welcome-greeting"
                    id="menugreeting"
                    onClick={this.onMenuClick} >

                    {UserImg}
                    <p id="menugreeting" className="leftcol-name">{this.state.welcome_greeting}</p>
                    <p id="menugreeting" className="down-caret">&#9660;</p>
                    {Menu}
                </div>


                {Pages}


                {/* <p className="leftcol-dashboards">DASHBOARDS</p>
                {Dashboards}
                <div className="leftcol-dashboards-container">
                    <Link to="/create-dashboard">
                        <p className="leftcol-dashboard-item leftcol-new-dashboard">+ &nbsp;Create a new dashboard</p>
                    </Link>

                </div> */}


                <div className="center-bottom-leftcol">
                    <div className="feedback-bar">
                        <p
                            onClick={this.onFeedbackClick}
                            className="feedback-bar-text">Feedback about this page?</p>
                        {FeedbackInput}
                    </div>
                </div>
            </div >
        )
    }

    render() {

        return this.LeftColWide()

    }
}



// this function maps the redux state to props this component can access
const mapStateToProps = state => {
    console.log(state)
    return {
        user: state.user,
        dashboards: state.dashboards
    }
}

export default connect(mapStateToProps, null)(LeftColumn);
import React, { Component } from 'react';
import logo_black from '../static/images/logos/super-logo-black.png';
import svg1 from '../static/images/undraw_blooming_jtv6.svg';
import home from '../static/images/home.svg';
import add from '../static/images/add-icon.svg';
import settings from '../static/images/settings.svg';
import list from '../static/images/list.svg';
import { connect, Provider } from 'react-redux';
import { Link } from 'react-router-dom';

class LeftColumn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_menu: false,
            page: props.page ? props.page : "",
            welcome_greeting: props.user.first_name ? `${props.user.first_name} ${props.user.last_name}` : "Welcome!",
            user_img: props.user.picture_url
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
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {


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
        return (
            <div className="Left">


                <div className="welcome-greeting"
                    id="menugreeting"
                    onClick={this.onMenuClick} >

                    {UserImg}
                    <p id="menugreeting" className="leftcol-name">{this.state.welcome_greeting}</p>


                    <p id="menugreeting" className="down-caret">&#9660;</p>
                    {Menu}
                </div>


                {Pages}

                <div className="center-bottom-leftcol">
                    <img alt="" src={svg1} className="left-col-svg" />
                </div>
            </div >
        )
    }
}



// this function maps the redux state to props this component can access
const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps, null)(LeftColumn);
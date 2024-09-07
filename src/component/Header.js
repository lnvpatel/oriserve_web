import React, { Component, Fragment } from 'react';
import './Header.css';

class Header extends Component {

    render(){
      
        return(
            <Fragment>
               <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>                        
                    </button>
                    <a className="navbar-brand" href="/">Developer Funnel</a>
                    </div>
                    <div className="collapse navbar-collapse" id="myNavbar">
                    <ul className="nav navbar-nav">
                        <li><a href="/">Home</a></li>
                        <li><a href="/page2">Page 2</a></li>
                        <li><a href="/page3">Page 3</a></li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li><a href="/signup"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
                        <li><a href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
                    </ul>
                    </div>
                </div>
                </nav>
            </Fragment>
        )
    }
}

export default Header;

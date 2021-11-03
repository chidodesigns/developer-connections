import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'
//  Import Navbar Classes
import classes from './Navbar.module.css';

export const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {

    const authLinks = (
        <ul>
             <li>
                <Link to="/profiles">
                    Developers
                </Link>
            </li>
            <li>
                <Link to="/posts">
                    Posts
                </Link>
            </li>
            <li>
                <Link to="/dashboard">
                    <i className="fas fa-user"><span className="hide-sm"> Dashboard</span></i>
                </Link>
            </li>
            <li>
                <Link to="#!" onClick={logout}><i className="fas fa-sign-out-alt"></i>{' '}<span className="hide-sm">Logout</span></Link>
            </li>
            

        </ul>
    )

    const guestLinks = (
        <ul>
            <li>
                <Link to="/profiles">Developers</Link>
            </li>
            <li>
                <Link to="/register">Register</Link>
            </li>
            <li>
                <Link to="/login">Login</Link>
            </li>
        </ul>
    )

    return (
        <nav className={`${classes.navbar} bg-dark`}>
            <h1>
                <Link to="/">
                    <i className="fas fa-code"></i> selftaughtcode.co
                </Link>
            </h1>
            {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)

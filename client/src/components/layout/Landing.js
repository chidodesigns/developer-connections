import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import classes from './Landing.module.css'

export const Landing = ({ isAuthenticated }) => {

    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }

    return (
        <section className={classes.landing}>
            <div className="dark-overlay">
                <div className={classes.landingInner}>
                    <h1 className="x-large"><span className="text-primary">Puerto Veijo</span></h1>
                    <div>
                    <p className="lead">
                        A Sandbox to <strong className="text-primary">connect</strong> and <strong className="text-primary">learn</strong> from DIY developers whilst you learn to code.
                    </p>
                    </div>
                    <div className="buttons">
                        <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        <Link to="/login" className="btn btn-light">Login</Link>
                    </div>
                </div>

            </div>
        </section>
    )
}

Landing.propTypes = {
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Landing)
import React, {Fragment, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {login} from '../../actions/auth';

import classes from './Forms.module.css';

function Login({login, isAuthenticated}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const {email, password} = formData;

  const onChange = (e) =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  //  Redirected If Logged In
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="flex-container container-80-vh">

      <div className="flex-container__item-50">
      <p className="lead">
            <strong className="text-primary">Selftaughtcode.co</strong> is a platform that connects <strong className="text-primary">DIY</strong> web developers.
        </p>
      </div>

      <div className="flex-container__item-50">
        <h2>Log In</h2>
        <form className={classes.form} onSubmit={(e) => onSubmit(e)}>
          <div className={classes.formGroup}>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className={classes.formGroup}>
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength="6"
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Dont have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {login})(Login);

import React, {useState} from 'react';
//  Enables Us To Work With Redux
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './Forms.module.css';

//   State Management: Actions
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';


//  Destructured & Pulled Out Of Props
function Register({setAlert, register, isAuthenticated}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const {name, email, password, password2} = formData;

  const onChange = (e) =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords Do Not Match', 'danger');
    } else {
      register({name, email, password});
    }
  };

  //  Redirected If Logged In
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
      <div className="flex-container container-80-vh">
        <div className="flex-container__item-50">
        <p className="lead">
            <strong className="text-primary">Puerto Veijo Jobs</strong> is a platform that connects <strong className="text-primary">DIY</strong> web developers.
        </p>
        </div>
        <div className="flex-container__item-50">
        <h2>Create An Account</h2>
        <form className={classes.form} onSubmit={(e) => onSubmit(e)}>
          <div className={classes.formGroup}>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className={classes.formGroup}>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
            />
            <small className="form-text">
              This site uses Gravatar for your profile choose a
              Gravatar email
            </small>
          </div>
          <div className={classes.formGroup}>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className={classes.formGroup}>
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              onChange={(e) => onChange(e)}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
        </div>      
      </div>
  );
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {setAlert, register})(Register);

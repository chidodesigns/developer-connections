import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import classes from './Footer.module.css';

function Footer () {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-dark">
       <p>&#169; selftaughtcode.co {currentYear}</p>  
</footer>
  );
};

export default Footer;

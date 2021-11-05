import React from 'react';


function Footer () {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-dark">
       <p>&#169; Puerto Veijo Jobs {currentYear}</p>  
</footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import PropTypes from 'prop-types';


const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  return (
    <div>
      <button 
        onClick={toggleVisibility} 
        style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {buttonLabel || "Show"} {/* Jos buttonLabel on tyhjä, käytetään oletusta */}
      </button>
      {visible && children}
    </div>
  );
};

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Togglable;
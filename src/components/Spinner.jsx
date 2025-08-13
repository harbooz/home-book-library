import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import Theme from '../Theme';

const SpinnerWrapper = styled.div.attrs({className: "isbn-wrapper"})`
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .spinner__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
  }

  .spinner {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: ${Theme.colors.whiteText || 'blue'};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 3rem auto;   
  }


`

export default function Spinner() {

  return (
   <SpinnerWrapper className="spinner__wrapper">    
      <div className="spinner" aria-label="Loading spinner" role="status" />
   </SpinnerWrapper>
  );
}

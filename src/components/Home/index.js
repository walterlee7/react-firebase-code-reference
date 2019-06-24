import React from 'react';
import './home.css';

import { withAuthorization } from '../Session';

const HomePage = () => (
    <div className='home-page-container'>
        <p className='home-page-title'>Home Page</p>
        <p className='home-page-text'>The Home Page is accessible by every signed in user.</p>
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
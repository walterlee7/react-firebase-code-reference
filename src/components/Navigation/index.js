import React from 'react';
import { Link } from 'react-router-dom';
import './navigation.css';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <div className='navigation-container'>
        <div className='navigation-link'>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </div>
        <div className='navigation-link'>
            <Link to={ROUTES.HOME}>Home</Link>
        </div>
        <div className='navigation-link'>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
        </div>
        <div className='navigation-link'>
            <Link to={ROUTES.ADMIN}>Admin</Link>
        </div>
        <div>
            <SignOutButton />
        </div>
    </div>
);

const NavigationNonAuth = () => (
    <div className='navigation-container'>
        <div className='navigation-link'>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </div>
        <div className='navigation-link'>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </div>
    </div>
);

export default Navigation;
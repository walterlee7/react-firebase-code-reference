import React from 'react';
import './account.css';

import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div className='account-page-container'>
                <p className='account-page-title'>Account: {authUser.email}</p>
                <PasswordForgetForm />
                <PasswordChangeForm />
            </div>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
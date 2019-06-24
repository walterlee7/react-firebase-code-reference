import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './passwordForget.css';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
    <div>
        <p className='password-forget-title'>Password Forget</p>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, error } = this.state;

        const isInvalid = email === '';

        return (
            <form className='password-forget-form' onSubmit={this.onSubmit}>
                <input
                    className='password-forget-input'
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <button className='password-forget-button' disabled={isInvalid} type="submit">
                    Reset My Password
        </button>

                {error && <p className='password-forget-error'>{error.message}</p>}
            </form>
        );
    }
}

const PasswordForgetLink = () => (
    <div className='password-forget-container'>
        <div className='password-forget-link'>
            <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
        </div>
    </div>

);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
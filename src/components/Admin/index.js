import React, { Component } from 'react';
import './admin.css';

import { withFirebase } from '../Firebase';

class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));
            this.setState({
                users: usersList,
                loading: false,
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    render() {
        const { users, loading } = this.state;
        return (
            <div className='admin-container'>
                <p className='admin-title'>Admin</p>

                {loading && <div className='admin-loading'>Loading ...</div>}

                <UserList users={users} />
            </div>
        );
    }
}

const UserList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.uid}>
                <div className='admin-text'>
                    <strong>ID:</strong> {user.uid}
                </div>
                <div className='admin-text'>
                    <strong>E-Mail:</strong> {user.email}
                </div>
                <div className='admin-text'>
                    <strong>Username:</strong> {user.username}
                </div>
            </li>
        ))}
    </ul>
);

export default withFirebase(AdminPage);
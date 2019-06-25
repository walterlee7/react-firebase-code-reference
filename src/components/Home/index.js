import React, { Component } from 'react';
import './home.css';

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

const HomePage = () => (
    <div className='home-page-container'>
        <p className='home-page-title'>Home Page</p>
        <p className='home-page-text'>The Home Page is accessible by every signed in user.</p>

        <Messages />
    </div>
);

class MessagesBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            loading: false,
            messages: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.messages().on('value', snapshot => {
            const messageObject = snapshot.val();

            if (messageObject) {
                const messageList = Object.keys(messageObject).map(key => ({
                    ...messageObject[key],
                    uid: key,
                }));

                this.setState({
                    messages: messageList,
                    loading: false
                });
            } else {
                this.setState({ messages: null, loading: false });
            }
        });
    }

    componentWillUnmount() {
        this.props.firebase.messages().off();
    }

    onChangeText = event => {
        this.setState({ text: event.target.value });
    };

    onCreateMessage = (event, authUser) => {
        this.props.firebase.messages().push({
            text: this.state.text,
            userId: authUser.uid,
        });

        this.setState({ text: '' });

        event.preventDefault();
    };

    onRemoveMessage = uid => {
        this.props.firebase.message(uid).remove();
    };

    onEditMessage = () => {

    };

    render() {
        const { text, messages, loading } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {loading && <div>Loading ...</div>}

                        {messages ? (
                            <MessageList
                                messages={messages}
                                onEditMessage={this.onEditMessage}
                                onRemoveMessage={this.onRemoveMessage}
                            />
                        ) : (
                                <div>There are no messages ...</div>
                            )}

                        <form onSubmit={event => this.onCreateMessage(event, authUser)}>
                            <input
                                type="text"
                                value={text}
                                onChange={this.onChangeText}
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const MessageList = ({ messages, onEditMessage, onRemoveMessage }) => (
    <ul>
        {messages.map(message => (
            <MessageItem
                key={message.uid}
                message={message}
                onEditMessage={onEditMessage}
                onRemoveMessage={onRemoveMessage}
            />
        ))}
    </ul>
);

const MessageItem = ({ message, onRemoveMessage }) => (
    <li>
        <strong>{message.userId}</strong> {message.text}
        <button
            type="button"
            onClick={() => onRemoveMessage(message.uid)}
        >
            Delete
        </button>
    </li>
);

const Messages = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);



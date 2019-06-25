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
            createdAt: this.props.firebase.serverValue.TIMESTAMP,
        });

        this.setState({ text: '' });

        event.preventDefault();
    };

    onRemoveMessage = uid => {
        this.props.firebase.message(uid).remove();
    };

    onEditMessage = (message, text) => {
        const { uid, ...messageSnapshot } = message;

        this.props.firebase.message(message.uid).set({
            ...messageSnapshot,
            text,
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
    };

    render() {
        const { text, messages, loading } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {loading && <div className='message-loading' >Loading ...</div>}

                        <form className='message-form' onSubmit={event => this.onCreateMessage(event, authUser)}>
                            <input
                                className='message-form-input'
                                placeholder='Enter Message'
                                type="text"
                                value={text}
                                onChange={this.onChangeText}
                            />
                            <button className='message-form-button' type="submit">Send</button>
                        </form>

                        {messages ? (
                            <MessageList
                                messages={messages}
                                onEditMessage={this.onEditMessage}
                                onRemoveMessage={this.onRemoveMessage}
                            />
                        ) : (
                                <div className='message-form-empty' >There are no messages ...</div>
                            )}
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


class MessageItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            editText: this.props.message.text,
        };
    }

    onToggleEditMode = () => {
        this.setState(state => ({
            editMode: !state.editMode,
            editText: this.props.message.text,
        }));
    };

    onChangeEditText = event => {
        this.setState({ editText: event.target.value });
    };

    onSaveEditText = () => {
        this.props.onEditMessage(this.props.message, this.state.editText);

        this.setState({ editMode: false });
    };

    render() {
        const { message, onRemoveMessage } = this.props;
        const { editMode, editText } = this.state;

        return (
            <li className='message-form-li'>
                {editMode ? (
                    <input
                        className='message-form-input'
                        type="text"
                        value={editText}
                        onChange={this.onChangeEditText}
                    />
                ) : (
                        <span className='message-form-container'>
                            <div className='message-form-text'>{message.userId}</div> <div className='message-form-text'>{message.text}</div>
                            <div className='message-form-text'>
                                {message.editedAt && <span>(Edited)</span>}
                            </div>
                        </span>
                    )}
                {editMode ? (
                    <span className='message-edit-container'>
                        <button className='message-form-button' onClick={this.onSaveEditText}>Save</button>
                        <button className='message-form-button' onClick={this.onToggleEditMode}>Reset</button>
                    </span>

                ) : (
                        <button
                            className='message-form-button'
                            onClick={this.onToggleEditMode}
                        >Edit
                        </button>
                    )}

                {!editMode && (
                    <button
                        className='message-form-button'
                        type="button"
                        onClick={() => onRemoveMessage(message.uid)}
                    >
                        Delete
              </button>
                )}
            </li>
        );
    }
}

const Messages = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);



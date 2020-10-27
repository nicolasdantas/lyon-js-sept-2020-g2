import React, { Component } from 'react';
import './ContactForm.css';

class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: '',
      email: '',
    };
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  handleMessageChange = (event) => {
    this.setState({
      message: event.target.value,
    });
  };

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  render() {
    return (
      <div className="form-wrapper">
        <form>
          <h2> Contact </h2>
          <div>
            <label>Nom</label>
            <input
              type="text"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </div>
          <div>
            <label> E-mail</label>
            <input
              type="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
          </div>
          <div>
            <label>Message</label>

            <textarea
              value={this.state.message}
              onChange={this.handleMessageChange}
            />
          </div>

          <div className="button">
            <button type="submit">Envoyer</button>
          </div>
        </form>
      </div>
    );
  }
}

export default ContactForm;

import React from 'react';

// Needs to be a smart component so it has state
class SignIn extends React.Component {

    constructor(props) {
        super();
        this.state = {
          signInEmail: '',
          signInPassword: ''
        }
      }
    

    onInputChange = (event) => {
        let inputID = event.target.id;
        switch (inputID) {
            case 'email-address':
                this.setState({signInEmail: event.target.value});
                break;
            case 'password':
                this.setState({signInPassword: event.target.value});
                break;
            default:
                break;
        }
    }
    
    onSignInSubmit = () => {
        console.log(JSON.stringify({
            email: this.state.signInEmail,
            password: this.state.signInPassword
        }))
        // Fetch POST request to server sending the user-subnmitted email and password combination
        fetch('https://infinite-anchorage-19454.herokuapp.com/sign-in', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user.id){
                this.props.loadUser(user);
                this.props.onRouteChange('home');
            }
        })
        // .then(users => this.setState({robots: users}));
        
        
    }

    render () {
        const { onRouteChange } = this.props;
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" onChange={this.onInputChange} />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" onChange={this.onInputChange} />
                            </div>
                        </fieldset>
                        <div className="">
                            <input
                                onClick={this.onSignInSubmit}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value="Sign In" />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
    
}

export default SignIn;
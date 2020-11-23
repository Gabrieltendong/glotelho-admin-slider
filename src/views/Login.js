import React from 'react'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import * as firebase from 'firebase'

class Login extends React.Component {

    state = {
        email: '',
        password: ''
    }

    onChangeHandler = event => {
        const { name, value } = event.currentTarget;
        if (name === "email") {
          this.setState({email: value})
        } else if (name === "password") {
          this.setState({password: value})
        }
    }

    signIn = (e) => {
        e.preventDefault()
        console.log('login',)
        const { email, password } = this.state
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((res) => {
            console.log('resp', res)
            this.props.dispatch({
                type: 'SET_USER',
                value: {
                    email: res.user.email,
                    token: res.user.refreshToken
                }
            })
            this.props.history.push('/admin/slider')
        })
        .catch((error) => {
            console.log('err', error)
        });
    }

    render(){
        return(
            <div id="login">
                <h3 className="text-center text-white pt-5">Login form</h3>
                <div className="container">
                    <div id="login-row" className="row justify-content-center align-items-center">
                        <div id="login-column" className="col-md-6">
                            <div id="login-box" className="col-md-12">
                                <form id="login-form" className="form" action="" method="post" >
                                    <h3 className="text-center text-primary">Login</h3>
                                    <div className="form-group">
                                        <label for="username" className="text-primary">Email:</label><br />
                                        <input 
                                            type="text" 
                                            name="email" 
                                            id="email" 
                                            className="form-control"
                                            onChange = {(e) => this.onChangeHandler(e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label for="password" className="text-primary">Password:</label><br />
                                        <input 
                                            type="text" 
                                            name="password" 
                                            id="password" 
                                            className="form-control"
                                            onChange = {(e) => this.onChangeHandler(e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button 
                                            className="btn btn-primary btn-md"
                                            onClick = {this.signIn}
                                        >
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(null, mapDispatchToProps)(withRouter(Login))
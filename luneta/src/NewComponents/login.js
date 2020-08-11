import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import './login.css';
import '../styles/button.css'

class login extends Component {
    state = {
        name: '',
        pass: '',
        remember_me: false
    }
    
    handleClick = (e, type) =>{
        e.preventDefault()
        if(type === 1){
            let users = this.props.users
            let name = this.state.name
            let pass = this.state.pass
            for(let i in users){
                if(name === users[i].name && pass === users[i].pass){
                    let expireDate = new Date()
                    expireDate.setMonth(expireDate.getMonth+1)
                    this.props.cookies.set(
                        'user',
                        {name: name, adm: users[i].adm, remember_me: this.state.remember_me},
                        {path: '/', expires: expireDate}
                    )
                    this.props.handleLogin(name, users[i].adm)
                    this.props.history.push('/home/noticias')
                    return
                }
            }
            alert("Credenciais incorretas")
        }else{
            this.props.handleSair()
        }
    }
    render(){
        return (
            <div className="span_box">
                <form className="login_box">
                    <div>
                        <div className="login">
                            <p style={{paddingLeft: 10, paddingRight: 10}}>Nome:</p>
                            <input
                                type="text"
                                required
                                onChange={(e)=>{this.setState({name: e.target.value})}}
                                value={this.state.name}
                            />
                        </div>
                        <div className="login">
                            <p style={{paddingLeft: 10, paddingRight: 10}}>Senha: </p>
                            <input
                                type="password"
                                required
                                onChange={(e)=>{this.setState({pass: e.target.value})}}
                                value={this.state.pass}
                            />
                        </div>
                        <div className="login">
                            <p style={{paddingLeft: 10, paddingRight: 10}}>Lembre-se de mim:</p>
                            <input
                                type="checkbox"
                                required
                                onChange={(e)=>{
                                    this.setState({remember_me: !this.state.remember_me})
                                }}
                                value={this.state.remember_me}
                            />
                        </div>
                    </div>
                    <div className="login_button">
                        <Link to="Home">
                            <button type="submit" onClick={(e) => this.handleClick(e, 1)}> Login </button>
                        </Link>
                        <button type="button" onClick={(e) => this.handleClick(e, 2)}> Cancelar </button>
                    </div>
                </form>
            </div>
            
        );
    }
}
export default withRouter(login);

import React, { Component } from 'react';
import FirebaseService from '../Services/FirebaseService';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import '../App.css';
import '../styles/h1.css';

import Login from './login';

const Headerdir = ({ isLogged, handleClickUnLog, handleClickLogin }) => {
  const content = (
    isLogged ? (
      <div className="App-header-dir">
        <p className="p">{isLogged}</p>
        <Link to='/'>
          <button className="button-login" onClick={() => handleClickUnLog()}>Sair</button>
        </Link>
      </div>
    ) : (
        <button className="button-login" onClick={() => handleClickLogin()}>Login</button>
      )
  )
  return (
    <div>
      {content}
    </div>
  );
}

class Header extends Component {
  constructor(props){
    super(props)
    props.cookies.remove('noticia_em_leitura', {path: '/'})
    let user, adm, remember_me
    try{
      remember_me = props.cookies.get('user').remember_me
      if(!remember_me){
        props.cookies.remove('user', {path: '/'})
      }
      user = props.cookies.get('user').name
      adm = props.cookies.get('user').adm
    }catch(e){
      // props.cookies.removeall({path: '/'})
      user = undefined
      adm = undefined
    }
    if(user !== undefined){
      if(String(this.props.location.pathname).split('/')[1] !== 'home'){
        this.props.history.push('/home/noticias')
      }
      this.state = {
        users: [],
        requestedLogin: false,
        isLogged: user,
        adm: adm
      }
    }else{
      if(String(this.props.location.pathname).split('/')[1] === 'home'){
        this.props.history.push('/')
      }
      this.state = {
        users: [],
        requestedLogin: false,
        isLogged: false,
        adm: false
      }
    }
  }
  
  componentDidMount = async () => {
    await FirebaseService.getAllUserData((dataReceived) => this.setState({ users: dataReceived }))
  }
  handleLogin = (user, adm) => {
    this.setState({
      isLogged: user,
      adm: adm,
      requestedLogin: false
    })
  }
  handleClickUnLog = () => {
    this.props.cookies.set('user', 'Not_Logged', {path: '/'})
    this.setState({
      isLogged: false
    })
  }
  handleClickLogin = () => {
    this.setState({
      requestedLogin: true
    })
  }
  render() {
    const link = this.state.isLogged ? '/home/noticias':'/'
    return (
      <div className="App">
        {this.state.requestedLogin ?
          <Login
            cookies={this.props.cookies}
            users={this.state.users}
            handleLogin={this.handleLogin}
            handleSair={() => { this.setState({ requestedLogin: false }) }}
          />
        : null}
        <header className="App-header">
          <Link to={link}>
            <img
              className="App-header-Logo"
              title="Logo"
              id="Logo"
              alt="Logo"
              src="/Luneta.svg"
              height="120px"
              width="120px"
            />
          </Link>
          <div className="App-header-Other">
            <h1 className="p-Title">Luneta</h1>
            <Headerdir
              isLogged={this.state.isLogged}
              handleClickUnLog={this.handleClickUnLog}
              handleClickLogin={this.handleClickLogin}
            />
          </div>
        </header>
      </div>

    );
  }
}
export default withCookies(Header);

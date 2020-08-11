import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import Tags from './NewComponents/Home/Tags/Tags'
import User from './NewComponents/Home/User/User'
import NoticiasLoged from './NewComponents/Home/Noticias/NoticiasLoged'
import CriarNotica from './NewComponents/Home/Noticias/CriarNoticia'

import Header from './NewComponents/Header'
import SubHeader from './NewComponents/SubHeader'

import NoticiasNLoged from './NewComponents/Leitor/NoticiasNLoged'
import LeitorNoticia from './NewComponents/Leitor/LeitorNoticia'

import TextEditor from './NewComponents/Teste/TextEditor'
// import MexendoBD from './NewComponents/Teste/MexendoBD'

import './App.css';
import './styles/h1.css';


class App extends Component {
    render() {
        return (
            <div className="App">
                <Route path='/' component={Header} />
                <Route path='/' exact component={NoticiasNLoged} />

                <Route path='/reading/:idNoticia' exact component={LeitorNoticia} />

                <Route path='/home' component={SubHeader} />
                <Route path='/home/usuario' exact component={User} />
                <Route path='/home/tags' exact component={Tags} />
                
                <Route path='/home/testes' exact component={TextEditor} />

                <Route path='/home/noticias' exact component={NoticiasLoged} />
                <Route path='/home/noticias/reading/:idNoticia' exact component={LeitorNoticia} />
                <Route path='/home/noticias/editing/:idNoticia' exact component={CriarNotica} />
                <Route path='/home/noticias/creating/' exact component={CriarNotica} />
            </div>
        );
    }
}

export default withCookies(App);
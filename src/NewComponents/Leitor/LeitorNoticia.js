import React, { Component } from 'react';
import FirebaseService from '../../Services/FirebaseService';
import { withCookies } from 'react-cookie';

import Node from '../Home/Noticias/Components/Node';
import findTags from '../Home/Noticias/Components/findTags';

import './Noticias.css';
import './CheckStyle.css';

function isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
}

class Noticias extends Component {
    constructor(props) {
        super(props)
        let noticia = String(this.props.location.pathname).split('/')[2]
        if(noticia === 'noticias'){
            noticia = String(this.props.location.pathname).split('/')[4]
        }
        this.state = {
            id: noticia,
            noticia:{
                Conteudo: [],
                Links: []
            }
        }
    }
    _isMounted = false
    componentWillUnmount = () => {
        this._isMounted = false;
    }
    componentDidMount=async()=>{
        this._isMounted = true
        if(this._isMounted){
            FirebaseService.getNoticiaData(this.state.id, (dataReceived) => {
                for(let i in dataReceived.Conteudo){
                    if(dataReceived.Conteudo[i].type === 1){
                        findTags(
                            dataReceived.Conteudo[i].cont,
                            dataReceived.Links,
                            0,
                            (result)=>{
                                if(result.length !== 1){
                                    dataReceived.Conteudo[i].cont = result
                                }
                            }
                        )
                    }
                }
                this.setState({noticia: dataReceived})
            })
        }
    }
    render() {
        let date1 = new Date(this.state.noticia.Data_Criacao).toLocaleDateString()
        let time1 = new Date(this.state.noticia.Data_Criacao).toLocaleTimeString()
        let date2 = new Date(this.state.noticia.Ultima_Edicao).toLocaleDateString()
        let time2 = new Date(this.state.noticia.Ultima_Edicao).toLocaleTimeString()
        return (
            <div className="readingBox">
                <div
                    className="readingBoxVoltar"
                    onClick={() => {
                        this.props.cookies.remove('noticia_em_leitura')
                        let page = String(this.props.location.pathname).split('/')
                        if(page[1] === 'home'){
                            this.props.history.push('/home/noticias/')
                        }else{
                            this.props.history.push('/')
                        }
                    }}>
                    Voltar
                </div>
                <h1 style={
                    { 
                        padding: '0px 10px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px'
                    }}
                >
                    {this.state.noticia.Titulo}
                </h1>
                {date1 !== 'Invalid Date'? (
                    <div style={{color: 'gray', padding: '0px 10px', fontSize: '10px'}}>
                        <span>
                            Data de Criação: {date1} ({time1})
                        </span>
                        <br/>
                        <span>
                            Data da Ultima Edição: {date2} ({time2})
                        </span>
                    </div>
                ) : null}
                
                <h3 style={{ padding: '0px 10px', fontSize: '18px' }}>{this.state.noticia.Resumo}</h3>
                {this.state.noticia.Conteudo.map((par, index) => {
                    if (par.type === 0) {
                        FirebaseService.downloadImage(par.cont, this.state.noticia.id + "item" + index)
                    }
                    return (
                        par.type === 0 ? (
                            <div className="conteudoBox" key={index}>
                                <img
                                    className="image"
                                    id={this.state.noticia.id + "item" + index}
                                    alt={this.state.noticia.id + "item" + index}
                                />
                                <span style={{color: 'gray'}}>{par.legenda}</span>
                            </div>
                        ) : par.type === 1 ?
                            <p key={index} style={{ padding: '0px 10px' }}>
                                {
                                    isArray(par.cont) ?
                                        <Node links={this.state.noticia.Links} text={par.cont}/> :
                                        par.cont
                                }
                            </p>
                        : par.type === 2 ?
                            <div className="conteudoBox" key={index}>
                                <img
                                    key={index}
                                    className="image"
                                    src={par.cont}
                                    id={this.state.noticia.id + "item" + index}
                                    alt={this.state.noticia.id + "item" + index}
                                />
                                <span style={{color: 'gray'}}>{par.legenda}</span>
                            </div>
                        : par.type === 3 ?
                            <div className="conteudoBox" key={index}>
                                <iframe
                                    className="video"
                                    id={this.state.noticia.id + "item" + index}
                                    alt={this.state.noticia.id + "item" + index}
                                    src={par.cont}
                                    frameBorder="0"
                                    samesite="none"
                                    allow="accelerometer;
                                    encrypted-media;
                                    gyroscope;
                                    picture-in-picture"
                                    title="KA"
                                />
                                <span style={{color: 'gray'}}>{par.legenda}</span>
                            </div>
                        : null
                    )
                })}
            </div>

        );
    }
}

export default withCookies(Noticias);
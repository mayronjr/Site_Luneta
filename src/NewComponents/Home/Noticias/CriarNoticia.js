import React, { Component } from 'react';
import { withCookies } from 'react-cookie';

import FirebaseService from '../../../Services/FirebaseService';
import SelectTag from './Components/SelectTag';
import SelectEditores from './Components/SelectEditores';
import TypeImageLocal from './Components/TypeImageLocal';
import TypeText from './Components/TypeText';
import TypeImageLink from './Components/TypeImageLink';
import TypeVideoLink from './Components/TypeVideoLink';
import TextPrevia from './Components/TextPrevia';
import LinkSelecting from './Components/LinkSelecting';

import './CriarNoticia.css';
import './CheckStyle.css';

class CriarNoticia extends Component {
    constructor(props) {
        super(props)
        let user = props.cookies.get('user').name
        let today = new Date()
        this.state = {
            User: user,
            Autor: user,
            Links: [],
            list_editores: [],
            Editores: [],
            Titulo: '',
            Resumo: '',
            Conteudo: [
                { type: 1, cont: '' }
            ],
            tags: [""],
            list_tags: [],
            focus: {
                start: 0,
                end: 0,
                hasChanged: false
            },
            Data_Criacao: today.getTime(),
            parts: [],
            parag: ''
        }
    }

    checkedT = (key) => {
        if (key === -1) {
            return
        }
        let list_tags = this.state.list_tags
        let tags = this.state.tags
        list_tags[key].checked = !list_tags[key].checked
        if (list_tags[key].checked) {
            tags.push(list_tags[key].key)
        } else {
            for (let i in tags) {
                if (tags[i] === list_tags[key].key) {
                    tags.splice(i, 1)
                }
            }
        }
        this.setState({
            list_tags: list_tags
        })
    }

    checkedE = (index) => {
        if (index === -1) {
            return
        }
        let list_editores = this.state.list_editores
        let Editores = this.state.Editores
        let permits = 0
        for (let i in list_editores) {
            if (list_editores[i].permit) {
                permits += 1
            }
        }
        if (!(permits === 1 && list_editores[index].permit)) {
            list_editores[index].permit = !list_editores[index].permit
            if (list_editores[index].permit) {
                Editores.push(list_editores[index].name)
            } else {
                for (let i in Editores) {
                    if (Editores[i] === list_editores[index].name) {
                        Editores.splice(i, 1)
                    }
                }
            }
        }
        this.setState({
            list_editores: list_editores
        })
    }

    handleSave = (e) => {
        e.preventDefault()
        let Noticia = this.state
        Noticia['Ultima_Edicao'] = new Date().getTime()
        FirebaseService.writeNoticiaData(this.state, (key) => {
            this.props.history.push('/home/noticias/reading/' + key)
        })
        if (String(this.props.location.pathname).split('/')[3] === 'editing') {
            let exist
            for (let i in this.state.tags_ant) {
                exist = false
                for (let j in this.state.tags) {
                    if (this.state.tags_ant[i] === this.state.tags[j]) {
                        exist = true
                        break
                    }
                }
                if (!exist) { // Foi retirado da lista de tags
                    FirebaseService.updateTagData(this.state.tags_ant[i], -1)
                }
            }
            for (let i in this.state.tags) {
                exist = false
                for (let j in this.state.tags_ant) {
                    if (this.state.tags_ant[i] === this.state.tags[j]) {
                        exist = true
                        break
                    }
                }
                if (!exist) { // Foi colocado da lista de tags
                    FirebaseService.updateTagData(this.state.tags[i], 1)
                }
            }
            let new_tags = []
            for (let i in this.state.tags) {
                new_tags.push(this.state.tags[i])
            }
            this.setState({
                tags_ant: new_tags
            })
        } else {
            for (let i in this.state.tags) {
                if (this.state.tags[i] !== '') {
                    FirebaseService.updateTagData(this.state.tags[i], 1)
                }
            }
        }
    }

    _isMounted = false
    componentWillUnmount = () => {
        this._isMounted = false;
    }

    componentDidMount = async () => {
        this._isMounted = true
        if (this._isMounted) {
            let id = String(this.props.location.pathname).split('/')[4]
            if (id !== '') {
                await FirebaseService.getNoticiaData(id, (dataReceived) => {
                    let tags_ant = []
                    for (let i in dataReceived.tags) {
                        tags_ant.push(dataReceived.tags[i])
                    }
                    this.setState({
                        Autor: dataReceived.Autor,
                        Editores: dataReceived.Editores,
                        Titulo: dataReceived.Titulo,
                        Resumo: dataReceived.Resumo,
                        Conteudo: dataReceived.Conteudo,
                        tags: dataReceived.tags,
                        tags_ant: tags_ant,
                        id: dataReceived.id,
                        Data_Criacao: dataReceived.Data_Criacao,
                        Ultima_Edicao: dataReceived.Ultima_Edicao,
                        Links: dataReceived.Links
                    })
                })
            }
            await FirebaseService.getAllUserData((dataReceived) => {
                let Editores = this.state.Editores
                let list_users = dataReceived
                let list_editores = []
                if (String(this.props.location.pathname).split('/')[3] === 'creating') {
                    Editores.push(this.state.Autor)
                }
                for (let i in list_users) {
                    list_editores[i] = {
                        name: list_users[i].key,
                        permit: false
                    }
                    for (let j in Editores) {
                        if (list_users[i].key === Editores[j]) {
                            list_editores[i].permit = true
                            break
                        }
                    }
                }
                this.setState({
                    list_editores: list_editores
                })
            })
            await FirebaseService.getAllTagData((dataReceived) => {
                let tags = this.state.tags
                let list_tags = dataReceived
                for (let i in list_tags) {
                    list_tags[i].checked = false
                    for (let j in tags) {
                        if (list_tags[i].key === tags[j]) {
                            list_tags[i].checked = true
                            break
                        }
                    }
                }
                this.setState({
                    list_tags: list_tags
                })
            })
            for (let i in this.state.Conteudo) {
                if (this.state.Conteudo[i].type === 0) {
                    var idElement = this.state.id + "item" + i
                    await FirebaseService.downloadImage(this.state.Conteudo[i].cont, idElement)
                }
            }
        }
    }

    render() {
        let date1 = new Date(this.state.Data_Criacao).toLocaleDateString()
        let time1 = new Date(this.state.Data_Criacao).toLocaleTimeString()
        let date2 = new Date(this.state.Ultima_Edicao).toLocaleDateString()
        let time2 = new Date(this.state.Ultima_Edicao).toLocaleTimeString()
        return (
            <form onSubmit={(e) => this.handleSave(e)} className="Box">
                <TextPrevia
                    parag={this.state.parag}
                    links={this.state.Links}
                    parts={this.state.parts}
                    close_window={()=>this.setState({parts: []})}
                />
                <LinkSelecting
                    link_selected={this.state.link_selected}
                    parag={this.state.parag}
                    resetLinks={(Links) =>{
                        this.setState({
                            Links: Links
                        })
                    }}
                    index={this.state.index}
                    Links={this.state.Links}
                    setState={(cont) =>{
                        let Conteudo = this.state.Conteudo
                        Conteudo[this.state.index].cont = cont
                        this.setState({
                            Conteudo: Conteudo
                        })
                    }}
                    closeWindow={() => this.setState({link_selected: !this.state.link_selected})}
                />
                <button type="button" style={{ width: '90%', padding: '2.5px', margin: '2.5px' }} onClick={() => this.props.history.push('/home/noticias')}>
                    Cancelar
                </button>
                <button type="submit" style={{ width: '90%', padding: '2.5px', margin: '2.5px' }} >Salvar</button>
                <label style={{ display: "flex", flexDirection: "row" }}>
                    Autor:
                    <input
                        className="Input-Title"
                        placeholder="Autor"
                        type="text" label="Autor" required
                        maxLength="100"
                        onChange={(e) => this.setState({ Autor: e.target.value })}
                        value={this.state.Autor}
                    />
                </label>
                <label>Editores:</label>
                <SelectEditores
                    checkedE={this.checkedE}
                    list_editores={this.state.list_editores}
                />
                <label>Tags: </label>
                <SelectTag
                    checkedT={this.checkedT}
                    tags={this.state.list_tags}
                />
                <div className="datas">
                    <span>
                        Data de Criação: {date1} ({time1})
                    </span>
                    <br/>
                    {this.state.Ultima_Edicao === undefined ? null : (
                        <span>
                            Data da Ultima Edição: {date2} ({time2})
                        </span>
                    )}
                </div>
                <input
                    className="Input-Title"
                    placeholder="Titulo"
                    type="text" label="Titulo" required
                    maxLength="100"
                    onChange={(e) => this.setState({ Titulo: e.target.value })}
                    value={this.state.Titulo}
                />
                <textarea
                    className="Input-Resumo"
                    placeholder="Resumo" label="Resumo" required
                    maxLength="1000"
                    onChange={(e) => this.setState({ Resumo: e.target.value })}
                    value={this.state.Resumo}
                />
                {
                    this.state.Conteudo.map((par, index) => {
                        return (
                            <div ref={"input" + index} key={index} className="Input-Conteudo-Box">
                                {par.type === 0 ? (
                                    <TypeImageLocal
                                        par={par}
                                        state={this.state}
                                        index={index}
                                        setState={(Data) => this.setState(Data)}
                                    />
                                ) : par.type === 1 ? (
                                    <TypeText
                                        cont={par.cont}
                                        state={this.state}
                                        index={index}
                                        setState={(Data) => this.setState(Data)}
                                    />
                                ) : par.type === 2 ? (
                                    <TypeImageLink
                                        par={par}
                                        state={this.state}
                                        index={index}
                                        setState={(Data) => this.setState(Data)}
                                    />
                                ) : par.type === 3 ? (
                                    <TypeVideoLink
                                        par={par}
                                        state={this.state}
                                        index={index}
                                        setState={(Data) => this.setState(Data)}
                                    />
                                ) : null}
                                <button type="button" className="Input-Conteudo-Button"
                                    onClick={(e) => {
                                        let Conteudo = this.state.Conteudo
                                        if (Conteudo.length === 1) {
                                            Conteudo.push({ type: 1, cont: '' })
                                        }
                                        if (Conteudo.length > 1) {
                                            if (Conteudo[index].type === 0 && Conteudo[index].cont !== '') {
                                                FirebaseService.deleteImage(Conteudo[index].cont)
                                            }
                                            Conteudo.splice(index, 1)
                                            this.setState({
                                                Conteudo: Conteudo
                                            })
                                        }
                                    }}
                                >X</button>
                            </div>
                        )
                    })
                }
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            let conteudo = this.state.Conteudo
                            conteudo.push({ type: 1, cont: "" })
                            this.setState({ Conteudo: conteudo })
                        }}
                    >Adicionar Paragrafo</button>
                    <button
                        type="button"
                        onClick={() => {
                            let conteudo = this.state.Conteudo
                            conteudo.push({ type: 0, cont: "", legenda: "" })
                            this.setState({ Conteudo: conteudo })
                        }}
                    >Adicionar Imagem Local</button>
                    <button
                        type="button"
                        onClick={() => {
                            let conteudo = this.state.Conteudo
                            conteudo.push({ type: 2, cont: "", legenda: "" })
                            this.setState({ Conteudo: conteudo })
                        }}
                    >Adicionar Imagem via Link</button>
                    <button
                        type="button"
                        onClick={() => {
                            let conteudo = this.state.Conteudo
                            conteudo.push({ type: 3, cont: "", legenda: "" })
                            this.setState({ Conteudo: conteudo })
                        }}
                    >Adicionar Video via Link</button>
                </div>
            </form>
        );
    }
}

export default withCookies(CriarNoticia);
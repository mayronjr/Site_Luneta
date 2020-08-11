import React, {Component} from 'react'
import { withCookies } from 'react-cookie';

import FirebaseService from '../../../Services/FirebaseService';
import CriarNoticia from './CriarNoticia';

import './Noticias.css';
import './CheckStyle.css';

const ExpandBox = ({noticias, handleClickButton, handleClickKnowMore, search, tags, userIsEditor, user}) =>{
    const listTags = tags.map(tag=>{
        function verificLT(){
            var show_every = true
            for(let i in tags){
                if(tags[i].checked){
                    show_every = false
                }
            }
            return(show_every)
        }
        return(verificLT() ? tag.key : (tag.checked ? tag.key : null))
    })
    
    const list1 = noticias.map((item, index)=>{
        function verific(tags_item){
            var exist = false
            if(tags_item === undefined){
                return true
            }
            if(tags_item.length <= 1){
                return true
            }
            for(let i in listTags){
                for(let j in tags_item){
                    if(listTags[i] === tags_item[j]){
                        exist = true
                    }
                }
            }
            return(exist)
        } 
        return(
            verific(item.tags) && String(item.Titulo).toLowerCase().includes(search.toLowerCase()) ? (
            <div key={item.id} className="Box">
                <div className="BoxTop">
                    <div 
                        className="BoxTopEsq"
                        onClick={() =>{handleClickButton(index, 'expand')}}>
                        <p>
                            {item.Titulo}
                        </p>
                    </div>
                    {user === null ? null : 
                        <div className="BoxTopDir">
                            <button
                                className="BoxTopButton"
                                disabled={userIsEditor(1, item.Editores)}
                                onClick={() =>{handleClickButton(index, 'rem')}}>
                                Deletar
                            </button>
                            <button
                                className="BoxTopButton"
                                disabled={userIsEditor(2, item.Editores)}
                                onClick={() =>{handleClickButton(index, 'edit')}}>
                                Editar
                            </button>
                        </div>
                    }
                    
                </div>
            {item.flags.extend ? (
                <div className="ExpandedText">
                    <p className="BoxMiddle">Autor: {item.Autor}</p>
                    <p className="BoxMiddle">{item.Resumo}</p>
                    <p className="BoxBottom" onClick={() => handleClickKnowMore(index)}>Leia Mais...</p>
                </div>
            ) : (
                null
            )}
            </div>) : null
        )
    })
    return(
        <div className="expandBox">
            {list1}
        </div>
    )
}

const SearchPerTag = ({tags, checked}) =>{
    const list = tags.map(
        (item, index)=>{
            let style = "Search-Check-Box"
            if(item.checked){
                style = "Search-Check-Box Selected"
            }
            return(
                <div className={style}
                    key={item.key}
                    onClick={() => checked(index)}
                    >
                    {/*<input
                        className="tagSearchBox"
                        type="checkbox"
                        checked={item.checked}
                        onChange ={() => checked(-1)}
                    />*/}
                    {item.Nome}
                </div>
            )
        })
    return(
        <div className="Search-Check">
            {list}
        </div>
    )
}

class Noticias extends Component{
    constructor(props){
        super(props)
        let user
        if(props.cookies.get('user') !== undefined){
            user = props.cookies.get('user').name
        }
        this.state = {
            user: user,
            noticias: [],
            tags: [],
            search : '',
            pag: 'home',
            noticia_edit: ''
        }
    }
    
    handleClickButton=(key, goal)=>{
        if(goal === 'expand'){
            this.handleExpand(key)
        }else if(goal === 'rem'){
            this.handleRem(key)
        }else if(goal === 'edit'){
            this.handleEdit(key)
        }
    }
    handleExpand = (key) =>{
        let noticias = this.state.noticias
        for(let i in noticias){
            if(i.toString() === key.toString()){
                noticias[i].flags.extend = !noticias[i].flags.extend
            }else{
                noticias[i].flags.extend = false
            }
        }
        this.setState({
            noticias: noticias
        })
    }
    handleRem = (key) =>{
        if (window.confirm('Tem certeza?')){
            FirebaseService.deleteNoticia(this.state.noticias[key].id, this.state.noticias[key].tags)
        }
        
    }
    handleEdit = async(key) =>{
        let noticias = this.state.noticias
        this.props.history.push('/home/noticias/editing/' + noticias[key].id)
    }

    handleClickKnowMore=async(key)=>{
        this.props.history.push('/home/noticias/reading/'+this.state.noticias[key].id)
    }

    checked = (key) =>{
        if(key === -1){
            return
        }
        let tags = this.state.tags
        tags[key].checked = !tags[key].checked
        this.setState({
            tags: tags
        })
        this.props.cookies.set(
            'data_tags',
            this.state.tags,
            {path: '/'}
        )
    }

    userIsEditor=(i, Editores)=>{
        for(let i in Editores){
            if(Editores[i] === this.state.user){
                return false
            }
        }
        return true
    }
    _isMounted = false
    componentWillUnmount = () => {
        this._isMounted = false;
    }
    componentDidMount = async() =>{
        this._isMounted = true
        if(this._isMounted){
            await FirebaseService.getAllTagData(
                (dataReceived) =>{
                    let tags = this.props.cookies.get('data_tags')
                    for(let i in dataReceived){
                        for(let j in tags){
                            if(dataReceived[i].key === tags[j].key){
                                dataReceived[i].checked = tags[j].checked
                                break
                            }
                        }
                    }
                    this.setState({tags: dataReceived})
                }
            )
            await FirebaseService.getAllNoticiaData(
                (dataReceived) =>this.setState({noticias: dataReceived})
            )
        }
    }

    render(){
        return(
            this.state.pag === 'home' ? (
                <div className="content">
                    <SearchPerTag
                        checked={this.checked}
                        tags={this.state.tags}
                    />
                    <div className="searchBar">
                        Pesquisar:
                        <input onChange={(e) => this.setState({search: e.target.value})}/>
                    </div>
                    {this.state.user === null ? null :
                        <button onClick={() => this.props.history.push('/home/noticias/creating/')}>
                            Criar nova Noticia
                        </button>
                    }
                    <ExpandBox
                        noticias={this.state.noticias}
                        search={this.state.search}
                        tags={this.state.tags}
                        handleClickButton={this.handleClickButton}
                        handleClickKnowMore={this.handleClickKnowMore}
                        userIsEditor={this.userIsEditor}
                        user={this.state.user}
                    />
                </div>
            ) : this.state.pag === 'creating' ? (
                <div className="creatingBox">
                    <button style={{width: '90%', padding: '2.5px', margin: '2.5px'}} onClick={() => this.setState({pag: 'home'})}>
                        Cancelar
                    </button>
                    <CriarNoticia
                        noticia_edit={this.state.noticia_edit}
                        user={this.state.user}
                        confirm={()=>this.setState({pag: 'home'})}
                    />
                </div>
            ) : null
            
        );
    }
}

export default withCookies(Noticias);
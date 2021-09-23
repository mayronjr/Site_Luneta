import React, {Component} from 'react';

import FirebaseService from '../../Services/FirebaseService';
import { withCookies } from 'react-cookie';

import './Noticias.css';
import './CheckStyle.css';

const ExpandBox = ({noticias, handleClickButton, handleClickKnowMore, search, tags}) =>{
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
                if(listTags[i] !== null){
                    for(let j in tags_item){
                        if(listTags[i] === tags_item[j]){
                            exist = true
                        }
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
                        onClick={() =>{handleClickButton(index)}}>
                        <p className="BoxTopEsqTitulo" style={{fontSize: '25px'}}>
                            {item.Titulo}
                        </p>
                    </div>
                </div>
            {item.flags.extend ? (
                <div className="ExpandedText">
                    <p className="BoxMiddle" style={{color: 'gray', padding: '0px 10px', fontSize: '12px'}}>Autor: {item.Autor}</p>
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
        this.state = {
            noticias: [],
            tags: [],
            search : ''
        }
    }
    
    handleClickButton=(key)=>{
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

    handleClickKnowMore=async(key)=>{
        this.props.history.push('/reading/'+this.state.noticias[key].id)
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
            <div className="content">
                <SearchPerTag
                    checked={this.checked}
                    tags={this.state.tags}
                />
                <div className="searchBar">
                    Pesquisar:
                    <input onChange={(e) => this.setState({search: e.target.value})}/>
                </div>
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
        );
    }
}

export default withCookies(Noticias);
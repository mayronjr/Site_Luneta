import React, {Component} from 'react'
import { withCookies } from 'react-cookie';

import FirebaseService from '../../../Services/FirebaseService';
import IndividualUser from './IndividualUser';


import './User.css'
import '../../../styles/button.css';

const DataTable = ({data, newuser, handleEntry, handleClick, addDisabled, remDisabled}) => {
    return <React.Fragment>
        <table className='table'>
            <tbody className='table'>
                <tr>
                    <td className='table'>Nome</td>
                    <td className='table'>Adm</td>
                </tr>
                <tr>
                    <td>
                        <input
                            className='tableNoCell'
                            type="text"
                            onChange={(e)=>handleEntry('name', e.target.value)}
                            value={newuser.name}
                        />
                    </td>
                    <td>
                        <input
                            className='tableNoCell'
                            type="checkbox"
                            onChange={(e)=>handleEntry('adm', null)}
                            checked={newuser.adm}
                        />
                    </td>
                    <td>
                        <button
                            disabled={addDisabled()}
                            className='button-tables'
                            onClick={()=>handleClick('add', null)}>
                            Adicionar
                        </button>
                    </td>
                </tr>
                {data.map((item, index) => 
                    <tr className='table' key={item.key}>
                        <td className='table'>{item.name}</td>
                        <td>
                            <input
                                readOnly
                                className='tableNoCell'
                                type="checkbox"
                                checked={item.adm}
                                onChange={(e)=>handleEntry('adm_change', item)}
                            />
                        </td>
                        <td>
                            <button
                                disabled={remDisabled(index)}
                                className='button-tables'
                                onClick={()=>handleClick('del', index)}>
                                Excluir
                            </button>
                        </td>
                    </tr>)
                }
            </tbody>
        </table>
        
    </React.Fragment>
};

class User extends Component{
    constructor(props){
        super(props)
        let className

        if(window.innerWidth <= 850){
            className = 'div-User Column'
            
        }else{
            className = 'div-User Row'
        }

        let user = props.cookies.get('user').name
        let adm = props.cookies.get('user').adm

        this.state = {
            user: user,
            adm: adm,
            users: [],
            newuser: {
                name: '',
                pass: '1234',
                adm: false
            },
            className: className
        }
    }
    handleEntry = (entry, value) =>{
        if(entry === 'name'){
            this.setState({
                newuser: {
                    name: value,
                    pass: this.state.newuser.pass,
                    adm: this.state.newuser.adm
                }
            })
        }
        if(entry === 'adm'){
            this.setState({
                newuser: {
                    name: this.state.newuser.name,
                    pass: this.state.newuser.pass,
                    adm: !this.state.newuser.adm
                }
            })
        }
        if(entry === 'adm_change'){
            value.adm = !value.adm
            FirebaseService.writeUserData(value)
        }
    }
    verif(text){
        let textValido = true
        if(text === '' || text.length < 3 || text.length > 15){
            textValido = false
        }
        for(let i in text){
            if(text[i] === ' '){
                textValido = false
            }
        }
        return textValido
    }

    addDisabled=()=>{
        if(this.verif(this.state.newuser.name) && this.verif(this.state.newuser.pass)){
            for(let i in this.state.users){
                if(this.state.users[i].name === this.state.newuser.name){
                    return true
                }
            }
            return false
        }else{
            return true
        }
    }

    remDisabled=(key)=>{
        if(this.state.users[key].adm){
            let adms = 0
            for(let i in this.state.users){
                if(this.state.users[i].adm){
                    adms += 1
                }
            }
            if(adms > 1){
                return false
            }else{
                return true
            }
        }else{
            return false
        }
    }

    handleClick = async(entry, key) =>{
        if(entry === 'add'){
            await FirebaseService.writeUserData(this.state.newuser)
            this.setState({
                newuser: {
                    name: '',
                    pass: '1234',
                    adm: false
                }
            })
        }
        if(entry === 'del' && window.confirm('Tem certeza?')){
            await FirebaseService.deleteUser(this.state.users[key].key)
        }
    }
    _isMounted = false
    componentWillUnmount = () => {
        this._isMounted = false;
        window.removeEventListener('resize', this.updateDimensions);
    }
    componentDidMount = async() =>{
        window.addEventListener('resize', this.updateDimensions);
        this._isMounted = true
        if(this._isMounted){
            await FirebaseService.getAllUserData((dataReceived) =>this.setState({users: dataReceived}))
        }
    }
    updateDimensions = () => {
        if(window.innerWidth <= 850){
            if(this.state.className !== 'div-User Column'){
                this.setState({
                    className: 'div-User Column'
                })
            }
        }else{
            if(this.state.className !== 'div-User Row'){
                this.setState({
                    className: 'div-User Row'
                })
            }
        }
    }

    render(){
        return(
            <div
                className={this.state.className}>
                {this.state.adm ?
                    <DataTable
                        data={this.state.users}
                        newuser={this.state.newuser}
                        handleEntry={this.handleEntry}
                        handleClick={this.handleClick}
                        addDisabled={this.addDisabled}
                        remDisabled={this.remDisabled}
                    />
                : null}
                <IndividualUser user={this.state.user}/>
            </div>
        );
    }
}

export default withCookies(User);
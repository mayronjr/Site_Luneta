import React, {Component} from 'react'
import FirebaseService from '../../../Services/FirebaseService';
import './User.css'
import '../../../styles/button.css';

class User extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: this.props.user,
            expanded: false,
            newpass1: '',
            newpass2: ''
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

    willItPass = () =>{
        if(
            this.verif(this.state.newpass1) && 
            this.verif(this.state.newpass2) &&
            this.state.newpass1 === this.state.newpass2
        ){
            return false
        }
        return true
    }

    updatePassword = async(e) =>{
        e.preventDefault()
        await FirebaseService.updateUserData(
            {name: this.state.user, pass: this.state.newpass1},
            (result) => {
                if(result ===  "Error"){
                    alert("Senha nova é igual a antiga")
                }
            }
            )
    }
    render(){
        return(
            <div className="div-Individual-User">
                <button className="button-User" onClick={()=> this.setState({expanded: !this.state.expanded})}>Deseja mudar a senha?</button>
                {this.state.expanded ? (
                    <div className="div-Individual-User-Form">
                        <p>A nova senha deve ter no minimo 3 e no maximo 15 caracteres e deve ser diferente da antiga.</p>
                        <form onSubmit={this.updatePassword}>
                            <input
                                placeholder="Nova Senha"
                                required type="password"
                                value={this.state.newpass1}
                                onChange={e => this.setState({newpass1: e.target.value})}/>
                            <p/>
                            <input
                                placeholder="Nova Senha"
                                required type="password"
                                value={this.state.newpass2}
                                onChange={e => this.setState({newpass2: e.target.value})}/>
                            <p/>
                            <button disabled={this.willItPass()} type="submit">Salvar</button>
                        </form>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default User;
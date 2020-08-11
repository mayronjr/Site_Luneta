import React, {Component} from 'react'
import FirebaseService from '../../../Services/FirebaseService';
import './Tags.css';
import '../../../styles/button.css';

const DataTable = ({data, newitem, handleEntry, handleClick, addDisabled, remDisabled}) => {
    return <React.Fragment>
        <table className='table'>
            <tbody className='table'>
                <tr>
                    <td className='table'>Nome</td>
                    <td className='table'>Quant de Noticias</td>
                </tr>
                <tr>
                    <td>
                        <input
                            className='tableNoCell'
                            type="text"
                            onChange={(e)=>handleEntry(e.target.value)}
                            value={newitem.nome}
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
                        <td className='table'>{item.Nome}</td>
                        <td className='table'>{item.Q_N}</td>
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

class Tags extends Component{
    state = {
        tags: [],
        newtag: {
            nome: ''
        }
    }
    handleEntry = (value) =>{
        this.setState({
            newtag: {
                nome: value
            }
        })
    }
    verif(text){
        let textValido = true
        if(text === '' || text.length < 3){
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
        if(this.verif(this.state.newtag.nome)){
            for(let i in this.state.tags){
                if(this.state.tags[i].nome === this.state.newtag.nome){
                    return true
                }
            }
            return false
        }else{
            return true
        }
    }

    remDisabled=(key)=>{
        if(this.state.tags[key].Q_N > 0){
            return true
        }else{
            return false
        }
    }

    handleClick = async(entry, key) =>{
        if(entry === 'add'){
            await FirebaseService.writeTagData(this.state.newtag.nome)
        }
        if(entry === 'del' && window.confirm('Tem certeza?')){
            await FirebaseService.deleteTag(this.state.tags[key].key)
        }
    }
    _isMounted = false
    componentWillUnmount = () => {
        this._isMounted = false;
    }
    componentDidMount = async() =>{
        this._isMounted = true;
        if(this._isMounted){
            await FirebaseService.getAllTagData((dataReceived) =>this.setState({tags: dataReceived}))
        }
    }

    render(){
        return(
            <div className="div-Tags">
                <DataTable
                    data={this.state.tags}
                    newitem={this.state.newtag}
                    handleEntry={this.handleEntry}
                    handleClick={this.handleClick}
                    addDisabled={this.addDisabled}
                    remDisabled={this.remDisabled}/>
            </div>
        );
    }
}

export default Tags;
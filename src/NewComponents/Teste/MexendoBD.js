import React, { Component } from 'react'
import './TextEditor.css'

import FirebaseService from '../../Services/FirebaseService'

class TextEditor extends Component {
    manda_bala = async() =>{
        console.log("Parece que certo deu");
        
        // let tags
        // await FirebaseService.getAllTagData((data)=>{
        //     tags = data
        // })
        // await FirebaseService.getAllNoticiaData((data) =>{
        //     // console.log(tags) //Importante: Nome e key
        //     // console.log(data) //mudar tags para a key correspondente
        //     for(let i in data){
        //         for(let j in tags){
        //             for(let z in data[i].tags){
        //                 if(data[i].tags[z] === tags[j].Nome){
        //                     data[i].tags[z] = tags[j].key
        //                 }
        //             }
        //         }
        //         console.log(data[i])
        //         FirebaseService.writeNoticiaData(data[i], null)
        //     }
        // })
    }
    render() {
        return (
            <button type="button" style={{width: '90%', padding: '2.5px', margin: '2.5px'}} onClick={() => this.manda_bala()}>
                Manda Bala
            </button>
        );
    }
}

export default TextEditor;
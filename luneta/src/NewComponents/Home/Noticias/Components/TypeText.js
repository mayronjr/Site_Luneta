import React from 'react';
import findTags from './findTags';
import TextFormating from './TextFormating';

import '../CheckStyle.css';

const TypeText = ({ cont, state, index, setState }) => {
    return (
        <div className="Input-Conteudo-Text">
            <TextFormating
                Links={state.Links}
                resetLinks={
                    (Links) =>{
                        setState({
                            Links: Links
                        })
                    }
                }
                index={index}
                setCont={
                    (cont) =>{
                        let Conteudo = state.Conteudo
                        Conteudo[index].cont = cont
                        setState({
                            Conteudo: Conteudo
                        })
                    }
                }
                setState={
                    (data)=>{
                        setState(data)
                    }
                }
                onClickPreviaButton={() => {
                    findTags(
                        cont,
                        state.Links,
                        0,
                        (parts) => {
                            setState({
                                parts: parts,
                                parag: 'Previa do Paragrafo ' + (index + 1)
                            })
                        }
                    )
                }}
            />
            <textarea
                id={"textArea" + index}
                className="Input-Conteudo-Text-textarea"
                placeholder="Conteudo" label="Conteudo" required
                maxLength="5000"
                onChange={(e) => {
                    if (state.key !== 'Ate agora none') {
                        let Conteudo = state.Conteudo
                        Conteudo[index].cont = e.target.value
                        setState({ Conteudo: Conteudo })
                    } else {
                        let Conteudo = state.Conteudo
                        Conteudo.push({ type: 1, cont: "" })
                        setState({ Conteudo: Conteudo, key: null })
                    }
                }}
                value={cont}
            />
        </div>
    )
}

export default TypeText;
import React from 'react';

import FirebaseService from '../../../../Services/FirebaseService';

import '../CheckStyle.css';

const TypeImageLocal = ({ par, state, index, setState }) => {
    return (
        <div className="Input-Conteudo-Image">
            <input type="file" onChange={(e) => {
                FirebaseService.uploadImage(e.target.files[0], index, state.id,
                    (Data) => {
                        let Conteudo = state.Conteudo
                        Conteudo[index].cont = Data.fullpath
                        setState({
                            id: Data.id,
                            Conteudo: Conteudo
                        })
                    }
                )}}
            />
            {par.cont !== '' ? (
                <input className="Input-Conteudo-Image-Link"
                    placeholder="Legenda" label="Legenda" required
                    value={par.legenda}
                    onChange={(e) => {
                        let Conteudo = state.Conteudo
                        Conteudo[index].legenda = e.target.value
                        setState({
                            Conteudo: Conteudo
                        })
                    }}
                />
            ) : null}
            {par.cont !== '' ? (
                <img
                    className="image"
                    id={state.id + "item" + index}
                    alt={state.id + "item" + index}
                />
            ) : null}
        </div>
    )
}

export default TypeImageLocal;
import React from 'react';

const TypeImageLink = ({ par, state, index, setState }) => {
    return (
        <div className="Input-Conteudo-Image">
            <input className="Input-Conteudo-Image-Link"
                placeholder="Hiperlink da Imagem" label="Hiperlink da Imagem" required
                value={par.cont}
                onChange={(e) => {
                    let Conteudo = state.Conteudo
                    Conteudo[index].cont = e.target.value
                    setState({
                        Conteudo: Conteudo
                    })
                }}
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
                    src={par.cont}
                    id={state.id + "item" + index}
                    alt={state.id + "item" + index}
                />
            ) : null}
        </div>
    )
}

export default TypeImageLink;
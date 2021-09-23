import React from 'react';

function verifyLink(link){
    link_não_suportado = false
    let link_parts = String(link).split('/'), link_video
    if(link_parts[3] === 'embed'){
        return link
    }
    let site = link_parts[2]
    if(site === 'youtu.be'){
        let id_video = link_parts[3].split('?')
        if(id_video.length === 2){
            if( id_video[0] === undefined){
                link_não_suportado = true
            }else{
                link_video = "https://www.youtube.com/embed/" + id_video[0]
            }
        }else{
            if( link_parts[3] === undefined){
                link_não_suportado = true

            }else{
                link_video = "https://www.youtube.com/embed/" + link_parts[3]
            }
        }
    }else if(site === 'www.youtube.com'){
        if( link_parts[3].split('=')[1] === undefined){
            link_não_suportado = true
        }else{
            link_video = "https://www.youtube.com/embed/" + link_parts[3].split('=')[1]
        }
    }else{
        link_não_suportado = true
    }

    if(link_não_suportado){
        return link
    }else{
        return link_video
    }
}

let link_não_suportado = false

const TypeVideoLink = ({ par, state, index, setState }) => {
    return (
        <div className="Input-Conteudo-Image">
            <input className="Input-Conteudo-Image-Link"
                placeholder="Hiperlink do Video" label="Hiperlink do Video" required
                value={par.cont}
                onChange={(e) => {
                    let Conteudo = state.Conteudo
                    let link = e.target.value
                    Conteudo[index].cont = link
                    setState({
                        Conteudo: Conteudo
                    })
                }}
            />
            <button
                onClick={(e)=>{
                    e.preventDefault()
                    let link = state.Conteudo[index].cont 
                    let Conteudo = state.Conteudo
                    Conteudo[index].cont = verifyLink(link)
                    setState({
                        Conteudo: Conteudo
                    })
                }}
                >
                Verificar Link
            </button>
            {link_não_suportado ? (
                <p>O link fornecido não é suportado. Por favor, verifique se o link está correto</p>
            ): null}
            {(par.cont !== '' && !link_não_suportado) ? (
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
            {(par.cont !== '' && !link_não_suportado) ? (
                <iframe
                    className="video"
                    id={state.id + "item" + index}
                    alt={state.id + "item" + index}
                    src={par.cont}
                    frameBorder="0"
                    samesite="none"
                    allow="accelerometer;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture"
                    title="KA"
                />
            ) : null}
        </div>
    )
}

export default TypeVideoLink;
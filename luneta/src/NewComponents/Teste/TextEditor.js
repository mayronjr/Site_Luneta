import React, { Component } from 'react'
import TextFormating from './TextFormating'
import TextPrevia from './TextPrevia'
import findTags from './findTags'


class TextEditor extends Component {
    state = {
        Conteudo: {
            cont: '<b><link1>w3schools</link1></b>'
        },
        parts: [],
        showWindowPortal: false,
        links: [{tag: 'link1', link: 'https://www.w3schools.com/tags/tag_a.asp'}]
    }


    render() {
        return (
            <div className="TextEditor">
                <TextPrevia
                    links={this.state.links}
                    parts={this.state.parts}
                    close_window={()=>this.setState({parts: []})}/>
                <TextFormating
                    links={this.state.links}
                    resetLinks={
                        (links) =>{
                            this.setState({
                                links: links
                            })
                        }
                    }
                    index='0'
                    setState={
                        (cont) =>{
                            let Conteudo = this.state.Conteudo
                            Conteudo.cont = cont
                            this.setState({
                                Conteudo: Conteudo
                            })
                        }
                    }
                />
                <textarea
                    id="textArea0"
                    rows="5"
                    className="Text"
                    value={this.state.Conteudo.cont}
                    onChange={(e) => {
                        let Conteudo = this.state.Conteudo
                        Conteudo.cont = e.target.value
                        this.setState({ Conteudo: Conteudo })
                        
                    }}
                />
                <button onClick={() => {
                        findTags(this.state.Conteudo.cont, this.state.links, 0, (parts) => this.setState({parts: parts}))
                    }}>
                    Previa do Paragrafo
                </button>
            </div>
        );
    }
}

export default TextEditor;
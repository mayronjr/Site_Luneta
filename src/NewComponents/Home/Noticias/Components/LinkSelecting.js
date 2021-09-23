import React, { Component } from 'react'
import './TextEditor.css'


class LinkSelecting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Links: props.Links,
            index: props.index,
            parag: props.parag,
            link_selected: props.link_selected,
            link_for_adittion: ''
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            Links: nextProps.Links,
            index: nextProps.index,
            parag: nextProps.parag,
            link_selected: nextProps.link_selected
        });
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth })
    }
    componentDidMount = () => {
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    editLinks = async (type, link) => {
        let textarea = document.getElementById('textArea' + this.state.index)
        let cont = textarea.value
        if (type === 'remove' && cont.indexOf('<' + link + '>') !== -1) {
            let parts = ['', '', '']
            parts[0] = cont.slice(0, cont.indexOf('<' + link + '>'))
            parts[1] = cont.slice(
                cont.indexOf('<' + link + '>') + ('<' + link + '>').length,
                cont.indexOf('</' + link + '>')
            )
            parts[2] = cont.slice(
                cont.indexOf('</' + link + '>') + ('</' + link + '>').length,
                cont.length
            )
            cont = parts[0] + parts[1] + parts[2]
            await this.props.setState(cont)
        }
        if (type === 'adicionar') {
            let selectionStart = textarea.selectionStart
            let selectionEnd = textarea.selectionEnd

            let start = cont.slice(0, selectionStart)
            let meio = cont.slice(selectionStart, selectionEnd)
            let end = cont.slice(selectionEnd, cont.length)
            if (meio === '') {
                meio = "Texto do link"
            }
            cont = start + '<' + link + '>' + meio + '</' + link + '>' + end
            await this.props.setState(cont)
            this.setState({ link_selected: !this.state.link_selected })
        }
    }

    render() {
        return (
            <div style={{ alignSelf: 'flex-start' }}>
                {this.state.link_selected ? (
                    <div className='span_box' style={{ marginTop: '-163px'}}>
                        <div className='login_box' style={style.previa_box}>
                            <div className="CloseWindow" onClick={this.props.closeWindow}><b>X</b>
                            </div><h2>{this.state.parag}</h2>
                            <input style={{ width: '100%' }} value={this.state.link_for_adittion} onChange={(e) => this.setState({ link_for_adittion: e.target.value })} />
                            <button type="button" onClick={() => {
                                let Links = this.props.Links
                                let tag = 'link', n = 1
                                while (tag.length === 4) {
                                    let exist = false
                                    for (let i in Links) {
                                        if (Links[i].tag === tag + n) {
                                            exist = true
                                        }
                                    }
                                    if (exist) {
                                        n += 1
                                    } else {
                                        tag += n
                                    }
                                }
                                Links.push({ tag: tag, link: this.state.link_for_adittion })
                                Links.sort((a, b) => {
                                    if (a.tag < b.tag) {
                                        return -1
                                    } else {
                                        return 1
                                    }
                                })
                                this.props.resetLinks(Links)
                            }}>Adicionar link</button>
                            {this.state.link_for_adittion}
                            <table className='table' style={{ width: '100%' }}>
                                <tbody className='table'>
                                    <tr>
                                        <td className='table'>Identificação</td>
                                        <td className='table'>Link</td>
                                    </tr>
                                    {this.props.Links.map((link, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className='table'>{link.tag}</td>
                                                <td className='table'>
                                                    <a style={{ textDecoration: 'none' }} href={link.link} target='_blank' rel="noopener noreferrer">{link.link}</a>
                                                </td>
                                                <td className='table' style={{ border: 'none' }}>
                                                    <button
                                                        type="button"
                                                        style={{ width: '100%' }}
                                                        onClick={() => {
                                                            this.editLinks('adicionar', link.tag)
                                                            this.props.closeWindow()
                                                        }}
                                                    >Adicionar no texto</button>
                                                </td>
                                                <td className='table' style={{ border: 'none' }}>
                                                    <button
                                                        type="button"
                                                        style={{ width: '100%' }}
                                                        onClick={() => {
                                                            let Links = this.props.Links
                                                            Links = Links.filter(item => item.tag !== link.tag)
                                                            this.editLinks('remove', link.tag)
                                                            this.props.resetLinks(Links)
                                                        }}
                                                    >Excluir Link</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

let style = {
    previa_box: {
        width: '75%',
        height: '75%',

        margin: '10px',
        padding: '10px',

        alignItems: 'center',
        justifyContent: 'start',
    }
}

export default LinkSelecting;
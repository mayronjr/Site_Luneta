import React, { Component } from 'react'


class TextEditor extends Component {
    constructor(props){
        super(props)
        this.state = {
            index: props.index,
            link_selected: false,
            link_for_adittion: 'aaaaaaa'
        }
    }

    formatText = async (type) => {
        let textarea = document.getElementById('textArea' + this.state.index)
        let cont = textarea.value
        let selectionStart = textarea.selectionStart
        let selectionEnd = textarea.selectionEnd

        let start = cont.slice(0, selectionStart)
        let meio = cont.slice(selectionStart, selectionEnd)
        let end = cont.slice(selectionEnd, cont.length)
        if (type === 'n') {
            if (meio === '') {
                meio = "Negrito"
            }
            cont = start + "<b>" + meio + "</b>" + end
        }
        if (type === 'i') {
            if (meio === '') {
                meio = "Italico"
            }
            cont = start + "<i>" + meio + "</i>" + end
        }
        if (type === 's') {
            if (meio === '') {
                meio = "Sublinhado"
            }
            cont = start + "<u>" + meio + "</u>" + end
        }
        if (type === 'link') {
            cont = start + "For Now Nothing" + end
        }
        await this.props.setState(cont)
        textarea.focus()
    }

    editLinks = async (type, link) =>{
        let textarea = document.getElementById('textArea' + this.state.index)
        let cont = textarea.value
        if(type === 'remove' && cont.indexOf('<' + link + '>') !== -1){
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
        if(type === 'adicionar'){
            let selectionStart = textarea.selectionStart
            let selectionEnd = textarea.selectionEnd

            let start = cont.slice(0, selectionStart)
            let meio = cont.slice(selectionStart, selectionEnd)
            let end = cont.slice(selectionEnd, cont.length)
            if (meio === '') {
                meio = "Texto do link"
            }
            cont = start + '<'+link+'>' + meio + '</'+link+'>' + end
            await this.props.setState(cont)
            this.setState({link_selected: !this.state.link_selected})
        }
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth})
    }
    componentDidMount = () => {
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
    
    render() {
        let permited = false
        if(this.state.width < 720){
            permited = true
        }
        return (
            <div className="Controls">
                {this.state.link_selected ? (
                    <div className='span_box' style={{marginTop: '-164px', marginLeft: '-1px'}}>
                        <div className='login_box'  style={style.previa_box}>
                            <div className="CloseWindow" onClick={() => this.setState({link_selected: !this.state.link_selected})}><b>X</b></div>
                            <input style={{width: '100%'}} value={this.state.link_for_adittion} onChange={(e)=>this.setState({link_for_adittion: e.target.value})}/>
                            <button onClick={()=>{
                                let links = this.props.links
                                let tag = 'link', n = 1
                                while(tag.length === 4){
                                    let exist = false
                                    for(let i in links){
                                        if(links[i].tag === tag+n){
                                            exist = true
                                        }
                                    }
                                    if(exist){
                                        n += 1
                                    }else{
                                        tag += n
                                    }
                                }
                                links.push({tag: tag, link: this.state.link_for_adittion})
                                links.sort((a, b) => {
                                    if(a.tag < b.tag){
                                        return -1
                                    }else{
                                        return 1
                                    }
                                })
                                this.props.resetLinks(links)
                            }}>Adicionar link</button>
                            {this.state.link_for_adittion}
                            <table className='table' style={{width: '100%'}}>
                                <tbody className='table'>
                                    <tr>
                                        <td className='table'>Identificação</td>
                                        <td className='table'>Link</td>
                                    </tr>
                                    {this.props.links.map((link, index) =>{
                                        return(
                                            <tr key={index}>
                                                <td className='table'>{link.tag}</td>
                                                <td className='table'>
                                                    <a style={{textDecoration: 'none'}} href={link.link} target='_blank' rel="noopener noreferrer">{link.link}</a>
                                                </td>
                                                <td className='table' style={{border: 'none'}}>
                                                    <button
                                                        style={{width: '100%'}}
                                                        onClick={()=>{
                                                            this.editLinks('adicionar', link.tag)
                                                        }}
                                                    >Adicionar no texto</button>
                                                </td>
                                                <td className='table' style={{border: 'none'}}>
                                                    <button
                                                        style={{width: '100%'}}
                                                        onClick={()=>{
                                                            let links = this.props.links
                                                            links = links.filter(item => item.tag !== link.tag)
                                                            this.editLinks('remove', link.tag)
                                                            this.props.resetLinks(links)
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
                <button
                    className={"ButtonControls"}
                    onClick={() => this.formatText('n')}>
                    <strong>B</strong>
                </button>
                <button
                    className={"ButtonControls"}
                    onClick={() => this.formatText('i')}>
                    <em>I</em>
                </button>
                <button
                    className={"ButtonControls"}
                    onClick={() => this.formatText('s')}>
                    <u>U</u>
                </button>
                <button
                    className={"ButtonControls"}
                    disabled={permited}
                    onClick={() => this.setState({link_selected: !this.state.link_selected})}>
                    HiperLink
                </button>
            </div>
        );
    }
}

let style ={
    previa_box: {
        width: '75%',
        height: '75%',
    
        margin: '10px',
        padding: '10px',
    
        alignItems: 'center',
        justifyContent: 'start',
    }
}

export default TextEditor;
import React, { Component } from 'react'


import './TextEditor.css'


class TextEditor extends Component {
    constructor(props){
        super(props)
        this.state = {
            Links: props.Links,
            index: props.index,
            link_selected: props.link_selected
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            text: nextProps.parts,
            Links: nextProps.Links,
            link_selected: nextProps.link_selected,
            parag: nextProps.parag
        });
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
        await this.props.setCont(cont)
        textarea.focus()
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
        if(this.state.width < 720 || this.state.Links === undefined){
            permited = true
        }
        return (
            <div className="Controls">
                <button
                    className={"ButtonControls"}
                    type="button"
                    onClick={() => this.formatText('n')}>
                    <strong>B</strong>
                </button>
                <button
                    className={"ButtonControls"}
                    type="button"
                    onClick={() => this.formatText('i')}>
                    <em>I</em>
                </button>
                <button
                    className={"ButtonControls"}
                    type="button"
                    onClick={() => this.formatText('s')}>
                    <u>U</u>
                </button>
                <button
                    className={"ButtonControls"}
                    type="button"
                    disabled={permited}
                    onClick={() => 
                        this.props.setState({
                            link_selected: !this.state.link_selected,
                            index: this.state.index,
                            parag: "Paragrafo " + (this.state.index + 1)
                        })
                    }>
                    HiperLink
                </button>
                <button
                    className={"ButtonControls"}
                    type="button"
                    onClick={() => this.props.onClickPreviaButton()}>
                    Previa do Paragrafo
                </button>
            </div>
        );
    }
}

export default TextEditor;
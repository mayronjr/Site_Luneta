import React, { Component } from 'react'

function isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
}

class Node extends Component {
    constructor(props){
        super(props)
        this.state = {
            text: props.text,
            links: props.links
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            text: nextProps.text, 
            links: nextProps.links
        });
    }

    render() {
        let parte_inicio = null
        if(this.state.text[0] !== undefined){
            parte_inicio = this.state.text[0]
        }else{
            parte_inicio = this.state.text
        }
        let parte_meio = null, link = null
        if(this.state.text[1] !== undefined){
            parte_meio = this.state.text[1]
            for(let i in this.state.links){
                if(this.state.links[i].tag === parte_meio.tag){
                    console.log(this.state.links[i], parte_meio)
                    link = this.state.links[i].link
                }
            }
        }
        let parte_fim = null
        if(this.state.text[2] !== undefined){
            parte_fim = this.state.text[2]
        }

        return (
            <span>
                {parte_inicio}
                {parte_meio !== null ? (
                    parte_meio.tag === 'b' ? (
                        <b>
                            {isArray(parte_meio.parts) ? <Node links={this.state.links} text={parte_meio.parts}/> : parte_meio.parts}
                        </b>
                    ) : parte_meio.tag === 'i' ? (
                        <i>
                            {isArray(parte_meio.parts) ? <Node links={this.state.links} text={parte_meio.parts}/> : parte_meio.parts}
                        </i>
                    ) : parte_meio.tag === 'u' ? (
                        <u>
                            {isArray(parte_meio.parts) ? <Node links={this.state.links} text={parte_meio.parts}/> : parte_meio.parts}
                        </u>
                    ) : parte_meio.tag !== undefined ? (
                        <a style={{textDecoration: 'none'}} href={link} target='_blank' rel="noopener noreferrer">
                            {isArray(parte_meio.parts) ? <Node text={parte_meio.parts}/> : parte_meio.parts}
                        </a>
                    ) : <span>{parte_meio}</span>
                ) : null}

                {parte_fim !== null ? (
                    parte_fim.tag === 'b' ? (
                        <b>
                            {isArray(parte_fim.parts) ? <Node links={this.state.links} text={parte_fim.parts}/> : parte_fim.parts}
                        </b>
                    ) : parte_fim.tag === 'i' ? (
                        <i>
                            {isArray(parte_fim.parts) ? <Node links={this.state.links} text={parte_fim.parts}/> : parte_fim.parts}
                        </i>
                    ) : parte_fim.tag === 'u' ? (
                        <u>
                            {isArray(parte_fim.parts) ? <Node links={this.state.links} text={parte_fim.parts}/> : parte_fim.parts}
                        </u>
                    ) : parte_fim.tag !== undefined ? (
                        <a style={{textDecoration: 'none'}} href={link} target='_blank' rel="noopener noreferrer">
                            {isArray(parte_fim.parts) ? <Node text={parte_fim.parts}/> : parte_fim.parts}
                        </a>
                    ) : isArray(parte_fim) ? <Node links={this.state.links} text={parte_fim}/> : parte_fim
                ) : null}
            </span>
        );
    }
}

export default Node
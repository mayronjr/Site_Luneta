import React, { Component } from 'react';

import Node from './Node';

import './TextEditor.css';

class TextPrevia extends Component {
    constructor(props){
        super(props)
        this.state = {
            text: props.parts,
            links: props.links,
            parag: props.parag
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            text: nextProps.parts,
            links: nextProps.links,
            parag: nextProps.parag
        });
    }

    render() {
        return (
            <div style={{alignSelf:'flex-start'}}>
                {this.state.text.length !== 0 ? (
                    <div className="span_box" style={{marginTop: '-163px'}}>
                        <div className="login_box" style={style.previa_box}>
                            <b className="CloseWindow" onClick={()=>this.props.close_window()}>X</b>
                            <h2>{this.state.parag}</h2>
                            <Node links={this.state.links} text={this.state.text}/>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
let style ={
    previa_box: {
        width: '50%',
        height: '75%',
    
        margin: '10px',
        padding: '10px',
    
        alignItems: 'center',
        justifyContent: 'start',
    }
}

export default TextPrevia;
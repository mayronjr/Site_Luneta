import React, { Component } from 'react';

import './Home.css';
import '../styles/button.css';

class SubHeader extends Component {
    constructor(props) {
        super(props)
        let page = String(this.props.location.pathname).split('/')[2]
        this.state = {
            listPags: ['Usuario', 'Tags', 'Noticias'],
            page: page.substring(0, 1).toUpperCase() + page.substring(1)
        }
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        let page = String(this.props.location.pathname).split('/')[2]
        this.setState({
            page: page.substring(0, 1).toUpperCase() + page.substring(1)
        })
    }
    handleClick = (page) => {
        this.props.history.push('/home/' + String(page).toLowerCase())
        this.setState({
            page: page
        })
    }
    render() {
        return (
            <header className="TopBar ContentBar">
                {this.state.listPags.map((item, index) => {
                    if (this.state.page !== item) {
                        return (
                            <div
                                key={index}
                                className="button-home"
                                onClick={() => this.handleClick(item)}
                            >{item}</div>
                        )
                    } else {
                        return (
                            <div
                                key={index}
                                className="button-home button-home-selected"
                            >{item}</div>
                        )
                    }
                })}
            </header>
        )
    }
}

export default SubHeader
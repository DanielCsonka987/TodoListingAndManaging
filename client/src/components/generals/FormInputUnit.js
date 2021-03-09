import React, { Component } from 'react'
import ReactCssTransitionGroup from 'react-transition-group'

const wrapperStyle = {
    position:"relative",
    padding: "0.2rem 1rem",
    textAlign: 'start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
}
const bubbleStyle = {
    position: 'absolute',
    display: 'block',
    zIndex: '3',
    opacity: '0.01',
    maxWidth: '6.5rem',
    padding: '0.4rem',
    top: '-1.2rem',
    right: '-7rem',
    background: '#FFF0C3',
    borderRadius: '13%',
    border: '1px solid grey',
    fontSize: '0.8rem'
}

class FormInputUnit extends Compoent{
    constructor(props){
        super(props)
        this.showBubbleOnScreen = this.showBubbleOnScreen.bind(this)
        this.removeBubbleOnScreen = this.removeBubbleOnScreen.bind(this)
        this.state = {
            bubbleContent: this.props.children
        }
    }

    showBubbleOnScreen(){

    }
    removeBubbleOnScreen(){

    }
    render(){
        const hiddenBubble = props.children?
            <span style={bubbleStyle} >{props.children}</span>: ''
        let sentClassNames = props.classes? props.classes : ''
        sentClassNames += keyboardFocus? ' showInputBubble': '';

        return (
            <div style={wrapperStyle} className={` ${sentClassNames}`}>
                <label htmlFor={props.id}>{props.label}</label>
                <input type={props.type} name={props.name} className={props.classesForInput}
                 id={props.id} value={props.value} 
                 onChange={props.funcChange}
                 onKeyPress={props.funcHitEnter}
                 onFocus={this.showBubbleOnScreen} onMouseOver={this.showBubbleOnScreen}
                 onBlur={this.removeBubbleOnScreen } onMouseOut={this.removeBubbleOnScreen}
                />
                { hiddenBubble }
            </div>
        )
    }
}

export default FormInputUnit;
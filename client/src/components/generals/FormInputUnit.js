import React, { Component } from 'react'
import { Transition } from 'react-transition-group'

const outerWrapperStyle = {
    position:"relative",

}
const innerWrapperStyle = {
    padding: "0.2rem 1rem",

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
}
const inputNumberStyle = {
    width: '2.5rem'
}
const inputTextStyle = {
    width: '45%'
}
const bubbleStyle = {
    position: 'absolute',
    zIndex: '3',
    opacity: '0.0',
    maxWidth: '6.5rem',
    padding: '0.4rem',
    top: '-1.2rem',
    right: '-7rem',
    background: '#FFF0C3',
    borderRadius: '13%',
    border: '1px solid grey',
    fontSize: '0.8rem',
    transition: 'opacity 16000ms ease'
}

class FormInputUnit extends Component{
    constructor(props){
        super(props)
        this.showBubbleOnScreen = this.showBubbleOnScreen.bind(this)
        this.removeBubbleOnScreen = this.removeBubbleOnScreen.bind(this)
        this.state = {
            bubbleAppearance: false,
        }
    }
    showBubbleOnScreen(){
      this.setState({ bubbleAppearance: true })
    }
    removeBubbleOnScreen(){
      this.setState({ bubbleAppearance: false })
    }
    render(){
        const hiddenBubble = this.state.bubbleAppearance?
            this.props.children? <span key={1} style={ bubbleStyle } >{this.props.children}</span> 
                : <span key={1}></span>
            : 
            <span key={1}></span>
        let inputStylingConfig = {}
        if(this.props.type === 'number'){
            inputStylingConfig =  inputNumberStyle
        }else{
            inputStylingConfig.width = this.props.neededInputWidth || inputTextStyle.width
        }
        let defMinMax = {};
        if(this.props.numberMinMax){
            defMinMax.min = this.props.numberMinMax[0]
            defMinMax.max = this.props.numberMinMax[1]
        }
        
        return (
            <div style={ {...outerWrapperStyle, ...this.props.additWrapperStyles} } 
                className={this.props.classes}>
                <div style={innerWrapperStyle}>
                    <label className='dataLabelMarking' htmlFor={this.props.id}>{this.props.label}</label>
                    <input style={ inputStylingConfig }
                        name={this.props.name} type={this.props.type}
                        id={this.props.id} value={this.props.value} { ...defMinMax }
                        onChange={this.props.funcChange}  onKeyPress={this.props.funcHitEnter}
                        onFocus={this.showBubbleOnScreen} onMouseOver={this.showBubbleOnScreen}
                        onBlur={this.removeBubbleOnScreen } onMouseOut={this.removeBubbleOnScreen}
                    />
                </div>
                <Transition 
                    transitionentertimeout={500}
                    transitionleavetimeout={500}
                    timeout={500}
                >
                    { hiddenBubble  }
                </Transition >
            </div>
            
        )
    }
}

export default FormInputUnit;
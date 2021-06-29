import React, { Component } from 'react'

class FormTextareaUnit extends Component{
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
        const hiddenTooltipBubble = this.state.bubbleAppearance && this.props.children?
            <span className={'textareaTooltipBubble'}>{this.props.children}</span>  : ''

        return (
            <div className={ 'formTextareaOuterWrapper ' + this.props.classes}>
                <div className='formTextareaInnerWrapper'>
                    <span>
                        <label className='formAndCardLabels' 
                            htmlFor={this.props.id}>{this.props.label}</label>
                        <span className='formTextareaCounter'> (Remained {this.props.maxCharLength-this.props.value.length + ' '}
                            from {this.props.maxCharLength})</span>
                    </span>
                    <textarea className='formTextareaInput'
                        rows={4} maxLength={this.props.maxCharLength}
                        name={this.props.name} id={this.props.id} 
                        value={this.props.value}
                        onChange={this.props.funcChange}  onKeyPress={this.props.funcHitEnter}
                        onFocus={this.showBubbleOnScreen} onMouseOver={this.showBubbleOnScreen}
                        onBlur={this.removeBubbleOnScreen } onMouseOut={this.removeBubbleOnScreen}
                    />
                </div>
                { hiddenTooltipBubble  }
            </div>
            
        )
    }
}

export default FormTextareaUnit;
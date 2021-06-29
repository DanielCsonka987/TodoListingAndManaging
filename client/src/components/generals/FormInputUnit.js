import React, { Component } from 'react'

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
        const hiddenTooltipBubble = this.state.bubbleAppearance && this.props.children?
            <span className={'btnTooltipBubble'}>{this.props.children}</span>  : ''

        let inputStylingConfig = ''
        if(this.props.type === 'number'){
            inputStylingConfig =  'formUnitInputNumberStyle'
        }else{
            inputStylingConfig =  'formUnitInputGeneralStyle'
        }
        let defMinMax = {};
        if(this.props.numberMinMax){
            defMinMax.min = this.props.numberMinMax[0]
            defMinMax.max = this.props.numberMinMax[1]
        }
        
        return (
            <div className={ 'formInputOuterWrapper ' + this.props.classes}>
                <div className='formInputInnerWrapper'>
                    <label className='formAndCardLabels' 
                        htmlFor={this.props.id}>{this.props.label}</label>
                    <input className={ inputStylingConfig }
                        name={this.props.name} type={this.props.type}
                        id={this.props.id} value={this.props.value} { ...defMinMax }
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

export default FormInputUnit;
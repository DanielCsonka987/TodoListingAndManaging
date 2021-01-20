import {React, Component} from 'react'

class ErrorHandler extends Component{
    constructor(props){
        super(props)
        this.state = {
            hasError: false
        }
    }

    static getDerivedStateFromError(error){
        this.setState({hasError: true})
    }

    componentDidCatch(error, errorInfo){
        console.log(error, errorInfo);
    }

    render(){
        if(this.hasError){
            return(
                <h3>The Application has an error at {this.props.location}!</h3>
            )
        }
        return(
            this.props.children
        )
    }
}

export default ErrorHandler
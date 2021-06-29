const options ={
    year: 'numeric',
    weekday: 'short',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit'
}

function TodoDateContent(props){
    const theDate = new Date(props.dateContent).toLocaleDateString('en-US', options);
    return (
        <p>
            <span className='dataLabelMarking'>{props.children} </span>
            <span>   {`${theDate} `}  </span>
        </p>
    )
}

export default TodoDateContent
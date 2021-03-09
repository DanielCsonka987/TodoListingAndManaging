function TodoDateContent(props){
    const theDate = props.dateContent;
    return (
        <div className='todoItemLeft'>
            {props.children + ' ' + theDate}
        </div>
    )
}

export default TodoDateContent
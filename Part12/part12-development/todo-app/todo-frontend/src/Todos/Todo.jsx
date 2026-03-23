const Todo = ({ todo }) => {
  return (
    <li>
      {todo.text} {todo.done ? '✅' : '❌'}
    </li>
  )
}

export default Todo

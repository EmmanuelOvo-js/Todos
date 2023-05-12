const input = document.querySelector('#todo-form').firstElementChild
const todoAPI = 'https://jsonplaceholder.typicode.com/todos'

fetchTodos = () => {
  fetch(todoAPI + '?_limit=10')
    .then(res => {
      if (!res.ok) {
        throw new Error('Developer is Running to Fix this Error')
      }
      return res.json()
    })
    .then((data) => {
      data.forEach((todoData) => { pushTodoToDOM(todoData) })
    }).catch((error) => {
      document.querySelector('.container').firstElementChild.innerHTML = `
      <p class="errorH">${error}</p>`
    })
}

pushTodoToDOM = (todoData) => {
  const div = document.createElement('div')
  div.classList.add('todo') //used for toggle event
  div.appendChild(document.createTextNode(todoData.title))
  div.setAttribute('data-id', todoData.id)
  const icon = document.createElement('i')
  icon.classList.add('fa-solid', 'fa-xmark', 'del')
  icon.style.color = 'red'
  icon.style.padding = '1rem'
  div.appendChild(icon)

  //check for completed todo
  if (todoData.completed) {
    div.classList.add('done')
  }

  //push to DOM
  document.querySelector('#todo-list').appendChild(div)
  // console.log(div)

  // clears input field
  input.value = ''
}

//Create Function
CreateTodo = (e) => {
  e.preventDefault()

  const newTodo = {
    title: e.target.firstElementChild.value,
    completed: false
  }

  fetch(todoAPI, {
    method: 'POST',
    body: JSON.stringify(newTodo),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then((data) => { pushTodoToDOM(data) })

}

//click a list to toggle to completed or not completed
toggleCompleted = (e) => {
  if (e.target.classList.contains('todo')) {
    e.target.classList.toggle('done')

    updateTodoList(e.target.dataset.id, e.target.classList.contains('done'))
  }
}

updateTodoList = (id, completed) => {
  fetch(`${todoAPI}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ completed }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

deleteTodo = (e) => {
  if (e.target.classList.contains('del')) {

    const id = e.target.dataset.id

    fetch(`${todoAPI}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json())
      .then(() => {
        e.target.parentElement.remove()
      })
  }
}


init = () => {
  document.addEventListener('DOMContentLoaded', fetchTodos)
  document.querySelector('#todo-form').addEventListener('submit', CreateTodo)
  document.querySelector('#todo-list').addEventListener('click', toggleCompleted)
  document.querySelector('#todo-list').addEventListener('click', deleteTodo)
}

init()
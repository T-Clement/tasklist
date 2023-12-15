// call to function to set the landing page content
checkUser();

const randomUserBtn = document.querySelector("#randomUser");
randomUserBtn.addEventListener("click", function() {
    fetchRandomUserName().then((response) => {
        // put in input value of random username fetch
        document.querySelector("#usernameForm").value = response.results[0].login.username;
    });
});

const registerBtn = document.querySelector("#register");

const form = document.querySelector("#formUsername");
// form to store in local storage the name of the user
form.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    localStorage.setItem("username", formData.get("usernameForm"));

    // call to function to display the content the page without the form
    checkUser();
});

// replace user name in localStorage in DOM
const username = document.querySelector("#username");
username.textContent = localStorage.getItem("username");

// initialize todos array to empty
let todos = [];

// get todos froms LocalStorage to display tasks
todos = getToDosFromLocalStorage();


// if no tasks in local storage, put a default task
if(todos === null) {
    console.log("Il faut mettre des todos par défault");
    todos = [
        {
            idTask: Date.now(),
            content: "Ceci est une tache par défaut",
            state: 0
        }
    ];  
    // send todos to localStorage
    sendToDosToLocalStorage(todos);
}




const todosToDoDOM = document.querySelector("#list-todo");
const todosDoneDOM = document.querySelector("#list-done");

// template use for the todo
const templateToDo = document.getElementById("template-todo");

// map on each Todo with call to function who place todos in DOM
if(todos.length != 0) {
    todos.map((element) => {
        if(element.state === 0) {
            addToDos(todosToDoDOM, element);
        } else {
            addToDos(todosDoneDOM, element);
        }
    });
}


// add task
const btnAddTaskDOM = document.querySelector("#btn-add-task");
let rotate = 0;
// toggle the visibility of add task form
btnAddTaskDOM.addEventListener("click", function(e) {
    rotate = rotate + 45;
    btnAddTaskDOM.style.transform = `rotate(${rotate}deg)`;
    formAddTaskDOM.classList.toggle("display-none");
});


// handle submit of form, push in todos current array and save new array in localStorage
const formAddTaskDOM = document.querySelector("#form-add-task");
formAddTaskDOM.addEventListener("submit", function(e) {
    e.preventDefault();
    const formDataAddTask = new FormData(e.target);

    // use of Date to get a unique id
    let idTask = Date.now();
    formDataAddTask.append("idTask", idTask);
    formDataAddTask.append("state", 0);
    
    // convert formData in JS Object
    let formDataObj = {};
    formDataAddTask.forEach((value, key) => {
        if(key !== "content") {
            formDataObj[key] = parseInt(value);
        } else {
            formDataObj[key] = value;
        }
    });
    // add todo to DOM
    addSingleToDo(formDataObj);

    // add todo JS Object to array of todos
    todos.push(formDataObj);
    
    // send array to local Storage
    sendToDosToLocalStorage(todos);
    
    // clean input value / text
    e.target.querySelector("#content").value="";
});





/* ----------------------------- */
/* ----------------------------- */
/* FUNCTIONS */ 

/**
 * This function generate and place in DOM the todos (element) related to their state
 * @param {*} typeOfTodoDOM 
 * @param {*} element 
 */
function addToDos(typeOfTodoDOM, element) {
    const clone = templateToDo.content.cloneNode(true);
    clone.querySelector("#task").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-delete").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-edit").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-check").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-input-edit").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".form-edit").dataset.idTask = parseInt(element.idTask);

    clone.querySelector("#content").textContent = element.content;
    clone.querySelector(".js-check").textContent = element.state ? "Remettre à faire" : "Passer à faire";
    
    // add of event listeners
    handleDelete(clone);
    handleCheck(clone);
    handleEdit(clone);
    
    typeOfTodoDOM.appendChild(clone);

}

function addSingleToDo(element, typeOfTodoDOM = todosToDoDOM) {
    const clone = templateToDo.content.cloneNode(true);
    clone.querySelector("#content").textContent = element.content;
    clone.querySelector("#task").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-delete").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-edit").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-check").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-input-edit").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".form-edit").dataset.idTask = parseInt(element.idTask);

    clone.querySelector(".js-check").textContent = element.state ? "Remettre à faire" : "Passer à faire";

    // add of event listeners
    // clone is a DOM element, element is the task as a JS Object
    handleDelete(clone, element);
    handleCheck(clone);
    handleEdit(clone);
    
    // append element to the DOM
    typeOfTodoDOM.appendChild(clone);


}



function handleDelete(elementDOM, element ="") {
    elementDOM.querySelector(".js-delete").addEventListener("click", function (e) {        
        todos.forEach((todo, index) => {
            if(todo.idTask == e.target.dataset.idTask) {
                todos.splice(index, 1);
                document.querySelector(`.js-list [data-id-task="${todo.idTask}"]`).remove();
                sendToDosToLocalStorage(todos);
            }

        });
    });
}

function handleCheck(elementDOM) {
    elementDOM.querySelector(".js-check").addEventListener("click", function(e) {
        
        todos.forEach((todo, index) => {
            if(todo.idTask == e.target.dataset.idTask) {
                if(todo.state == 0) {
                    todo.state = 1;
                    document.querySelector(`.js-list [data-id-task="${todo.idTask}"]`).remove();
                    addSingleToDo(todo, todosDoneDOM);
                } else if (todo.state == 1) {
                    todo.state = 0;
                    document.querySelector(`.js-list [data-id-task="${todo.idTask}"]`).remove();
                    addSingleToDo(todo);
                }
                sendToDosToLocalStorage(todos)
            }
        });
        
    });

}


function handleEdit(elementDOM) {

    elementDOM.querySelector(".js-edit").addEventListener("click", function(e) {
        document.querySelector(`.js-list form[data-id-task="${e.target.dataset.idTask}"]`).classList.toggle("display-none");
        document.querySelector(`.js-list form[data-id-task="${e.target.dataset.idTask}"]`).addEventListener("submit", function(e) {
            e.preventDefault();
            document.querySelector(`.js-list form[data-id-task="${e.target.dataset.idTask}"]`).classList.toggle("display-none");
            console.log(e.target);
            console.log(e);
            let editFormData = new FormData(e.target);
            console.log(editFormData);

            todos.forEach((todo, index) => {
                if(todo.idTask == e.target.dataset.idTask) {
                    todo.content = editFormData.get("edit-task");
                    document.querySelector(`.js-list [data-id-task="${e.target.dataset.idTask}"] #content`).textContent = todo.content;
                }
            });
            sendToDosToLocalStorage(todos);
        });
    });
}



/**
 * This function fetch a random user from an API
 * @returns 
*/
async function fetchRandomUserName() {
    const response = await fetch("https://randomuser.me/api/");
    return await response.json();
}


/**
 * This function is called at each change on a task (state, creation, delete, edit) 
 * @param {Object} todos 
 */
function sendToDosToLocalStorage(todos) {
    localStorage.setItem("tasks", JSON.stringify(todos));
}

function getToDosFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks"));
}




function checkUser () {
    // if no user in localStorage, display none of main 
    if(localStorage.getItem("username") == null) {
        document.querySelector(".container").style.display = "none";
        // username.textContent = "no-username";
    } else {
        document.querySelector("#mask").style.display = "none";
        document.querySelector(".container").style.display = "block";
        document.querySelector("#username").textContent = localStorage.getItem("username");
    };
}



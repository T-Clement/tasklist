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
    console.log(formData);
    localStorage.setItem("username", formData.get("usernameForm"));

    // call to function to display the content the page without the form
    checkUser();
    // checkTodos() ???
});

// replace user name in localStorage in DOM
const username = document.querySelector("#username");
username.textContent = localStorage.getItem("username");




// a alimenter en JS a chaque mise à jour du contenu de la page 
// et les interactions
let todos = [];
// console.log(todos);

// sendToDosToLocalStorage(todos);


// get todos froms LocalStorage to display tasks
todos = getToDosFromLocalStorage();

// let lengthOfTodos = todos.length;



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
    console.log(e.target);
    const formDataAddTask = new FormData(e.target);

    // use of Date to get a unique id
    let idTask = Date.now();
    formDataAddTask.append("idTask", idTask);
    // lengthOfTodos++;
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

    addSingleToDo(formDataObj);

    todos.push(formDataObj);
    
    // send array to local Storage
    sendToDosToLocalStorage(todos);
    
    // clean input value / text
    e.target.querySelector("#content").value="";
});

// problème sur les listes de tache vides ?
// ajouter les différentes fonctions de gestions des différentes actions / clics à la génération de la liste
// et lorsqu'une nouvelle tache est générée


function handleDelete(elementDOM, element ="") {
    elementDOM.querySelector(".js-delete").addEventListener("click", function (e) {        
        // console.log("Tu veux supprimer ?"); return;
        todos.forEach((todo, index) => {
            // console.log(todo);
            if(todo.idTask == e.target.dataset.idTask) {
                // console.warn("ToDO concernée");
                // console.warn(todo);
                // console.log(index);
                todos.splice(index, 1);
                // console.log(elementDOM);
                // console.warn("element à supprimer");
                // console.warn(document.querySelector(`.js-list [data-id-task="${todo.idTask}"]`));
                document.querySelector(`.js-list [data-id-task="${todo.idTask}"]`).remove();
                // console.log(todos);
                sendToDosToLocalStorage(todos);
            }

        });
    });
}

function handleCheck(elementDOM) {
    // console.log(elementDOM.querySelector(".js-check"));
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
    clone.querySelector("#content").textContent = element.content;
    clone.querySelector(".js-check").textContent = element.state ? "Remettre à faire" : "Passer à faire";
    
    // add of event listeners
    handleDelete(clone);
    handleCheck(clone);

    
    typeOfTodoDOM.appendChild(clone);

}

function addSingleToDo(element, typeOfTodoDOM = todosToDoDOM) {
    const clone = templateToDo.content.cloneNode(true);
    clone.querySelector("#content").textContent = element.content;
    clone.querySelector("#task").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-delete").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-edit").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-check").dataset.idTask = parseInt(element.idTask);
    clone.querySelector(".js-check").textContent = element.state ? "Remettre à faire" : "Passer à faire";

    // add of event listeners
    // clone is a DOM element, element is the task as a JS Object
    handleDelete(clone, element);
    handleCheck(clone);
    
    
    // append element to the DOM
    typeOfTodoDOM.appendChild(clone);


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

    };
}



// envoi du json au localStorage à chaque changement
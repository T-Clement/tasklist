// call to function to set the landing page content
checkUser();



// 
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
let todos = [
    // {
    //     idTask: 1,
    //     content: "Sortir le chien",
    //     state: 0
    // },
    // {
    //     idTask: 2,
    //     content: "Rendre l'évaluation",
    //     state: 0
    // },
    // {
    //     idTask: 3,
    //     content: "Manger à midi",
    //     state: 0
    // },
    // {
    //     idTask: 4,
    //     content: "Se lever",
    //     state: 1
    // },
    // {
    //     idTask: 5,
    //     content: "Venir en voiture",
    //     state: 1
    // },
    // {
    //     idTask: 6,
    //     content: "Se faire un thé",
    //     state: 1
    // },
]
// console.log("")
console.log(todos);

// sendToDosToLocalStorage(todos);


let todosImport = [];
todosImport = getToDosFromLocalStorage();
// todosTest = [1,2,3]
console.log(todosImport);





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


const formAddTaskDOM = document.querySelector("#form-add-task");
formAddTaskDOM.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log(e.target);
    const formDataAddTask = new FormData(e.target);
    let idTask = todos.length + 1
    formDataAddTask.append("idTask", idTask);
    // lengthOfTodos++;
    formDataAddTask.append("state", 0);
    

    let formDataObj = {};
    formDataAddTask.forEach((value, key) => {
        if(key !== "content") {
            formDataObj[key] = parseInt(value)
        } else {
            formDataObj[key] = value
        }
    });

    addSingleToDo(formDataObj);

    todos.push(formDataObj);
    // console.log(todos);
    // console.log(getToDosFromLocalStorage());
    // console.log(todos);
    
    // !!!!!!!!!!!!!!!!
    // send array to local Storage
    sendToDosToLocalStorage(todos);
    // !!!!!!!!!!!!!!!!
    


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
    clone.querySelector("#content").textContent = element.content;
    clone.querySelector(".js-check").textContent = element.state ? "Passer à faire" : "Remettre à faire";
    typeOfTodoDOM.appendChild(clone);
}

function addSingleToDo(element) {
    const clone = templateToDo.content.cloneNode(true);
    clone.querySelector("#content").textContent = element.content;
    todosToDoDOM.appendChild(clone);
}


/**
 * This function fetch a random user from an API
 * @returns 
*/
async function fetchRandomUserName() {
    const response = await fetch("https://randomuser.me/api/");
    return await response.json();
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
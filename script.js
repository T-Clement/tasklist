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
    localStorage.setItem("username", formData.get("username"));

    // call to function to display the content the page without the form
    checkUser();
});

// replace user name in localStorage in DOM
const username = document.querySelector("#username");
username.textContent = localStorage.getItem("username");




// 
let todos = [
    {
        idTask: 0,
        content: "Sortir le chien",
        state: 0
    },
    {
        idTask: 1,
        content: "Rendre l'évaluation",
        state: 0
    },
    {
        idTask: 0,
        content: "Manger à midi",
        state: 0
    },
]


const todosToDo = document.querySelector("#")











/* ----------------------------- */
/* ----------------------------- */
/* FUNCTIONS */ 


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
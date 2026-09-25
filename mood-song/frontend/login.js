const signInForm = document.querySelector(".sign-in form");
const signUpForm = document.querySelector(".sign-up form");


// SIGN IN
signInForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Temporary login
    // Real authentication will be added later

    localStorage.setItem("vibeTuneLoggedIn", "true");

    window.location.href = "index.html";

});


// SIGN UP
signUpForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Temporary signup
    // Real account creation will be added later

    localStorage.setItem("vibeTuneLoggedIn", "true");

    window.location.href = "index.html";

});
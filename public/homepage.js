document.addEventListener("DOMContentLoaded", function() {

    signup_button = document.querySelector("#sign-up-button");
    login_button= document.querySelector("#login-button");

    signup_button.addEventListener("click", function(){
        window.location.href = "/signup";
    });//end of sign up event

    login_button.addEventListener("click", function(){
        window.location.href = "/login";
    });
});//end of document
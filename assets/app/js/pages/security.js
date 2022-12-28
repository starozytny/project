import "../../css/pages/security.scss"

let btnSeePassword = document.querySelector('.btn-see-password');
if(btnSeePassword){
    let seePassword = false;
    let inputSeePassword = document.querySelector('#inputPassword');
    btnSeePassword.addEventListener('click', function (e){
        if(seePassword){
            seePassword = false;
            inputSeePassword.type = "password";
            btnSeePassword.classList.remove("active");
        }else{
            seePassword = true;
            inputSeePassword.type = "text";
            btnSeePassword.classList.add("active");
        }
    })
}

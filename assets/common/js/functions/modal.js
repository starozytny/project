function initListener (identifiant) {
    let body = document.querySelector("body");
    let modal = document.getElementById(identifiant);
    let btns = document.querySelectorAll(".close-modal");

    body.style.overflow = "hidden";
    modal.style.display = "block"

    window.onclick = (e) => {
        if(e.target === modal){
            body.style.overflow = "auto";
            modal.style.display = "none";
        }
    }

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            body.style.overflow = "auto";
            modal.style.display = "none";
        })
    })
}

module.exports = {
    initListener
}

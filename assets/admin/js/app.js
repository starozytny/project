import '../css/app.scss';

menu();

function menu() {
    let btn = document.querySelector('.nav-mobile');
    if(btn){
        btn.addEventListener('click', function () {
            let content = document.querySelector('.nav-content');
            if(content.classList.contains('active')){
                content.classList.remove('active');
            }else{
                content.classList.add('active');
            }
        })
    }
}

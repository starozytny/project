import "../css/app.scss"

import '@commonFunctions/toastrOptions';

import toastr from "toastr";

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


let flashes = document.getElementById("flashes");
if(flashes){
	let data = JSON.parse(flashes.dataset.flashes);
	Object.entries(data).forEach(([key, value]) => {
		switch (key){
			case 'error':
				toastr.error(value, 'Erreur'); break;
			default:
				toastr.info(value); break;
		}
	})
}

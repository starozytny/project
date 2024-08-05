function menuListener() {
	let body = document.querySelector("body");
	let btns = document.querySelectorAll('.nav-mobile');
	btns.forEach(btn => {
		btn.addEventListener('click', function () {
			menuClose(body);
		})
	})
}

function menuClose (body) {
	let content = document.querySelector('#nav-content');
	let svgs = document.querySelectorAll('#nav-mobile-main-btn > svg');

	svgs.forEach(svg => {
		if(svg.classList.contains('hidden')){
			svg.classList.remove('hidden');
			svg.classList.add('flex');
		}else{
			svg.classList.remove('flex');
			svg.classList.add('hidden');
		}
	})

	if(content.classList.contains('hidden')){
		content.classList.remove('hidden');
		content.classList.add('block');
		content.style.zIndex = 50;
		content.style.overflow = "auto";
		body.style.overflow = "hidden";
	}else{
		content.classList.remove('block');
		content.classList.add('hidden');
		content.style.zIndex = -10;
		content.style.overflow = "hidden";
		body.style.overflow = "auto";
	}
}

module.exports = {
	menuListener,
	menuClose
}

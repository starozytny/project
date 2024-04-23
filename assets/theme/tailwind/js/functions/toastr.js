const { uid } = require("uid");

function flashes() {
	let flashes = document.getElementById("flashes");
	if (flashes) {
		let timer = -300;
		let data = JSON.parse(flashes.dataset.flashes);
		Object.entries(data).forEach(([key, values]) => {

			values.forEach((value, index) => {
				timer = timer + 300;

				toast(key, value, null, null, timer);

				if(key === "same"){
					let elError = document.getElementById('error-login-session');
					if (elError) {
						elError.style.display = "block";
					}
				}
			})
		})
	}
}

function toast (type, text, nTitle, nIcon, timer) {
	let flashes = document.getElementById("flashes");

	let id = uid();
	let icon = nIcon, iconColor = "text-gray-600", title = nTitle;
	if(type === "error" || type === "same"){
		icon = nIcon ? nIcon : "error";
		iconColor = "text-red-600";
		title = nTitle ? nTitle : "Erreur";
	}else if(type === "info" ||type === "success"){
		icon = nIcon ? nIcon : "check-1";
		iconColor = "text-blue-600";
		title = nTitle ? nTitle : "Information";
	}else if(type === "warning"){
		icon = nIcon ? nIcon : "warning";
		iconColor = "text-yellow-500";
		title = nTitle ? nTitle : "Attention";
	}

	flashes.innerHTML += `
		<div id="toast-${id}" class="cursor-pointer bg-white rounded-lg p-4 ring-1 ring-gray-300 shadow-2xl min-w-80 max-w-96 flex justify-between gap-4 opacity-0 transition-all hover:scale-105" 
			onclick="this.remove()">
			<div class="flex gap-3">
				<div class="text-xl ${iconColor}">
					<span class="icon-${icon} !font-medium"></span>
				</div>
				<div>
					${title ? `<div class="font-medium">${title}</div>` : ""}
					<div class="opacity-70 text-sm">${text}</div>
				</div>
			</div>
			<div class="cursor-pointer"> 
				<span class="icon-cancel"></span>
			</div>
		</div>
	`
	setTimeout(() => {
		let d = document.getElementById('toast-' + id)
		if(d){
			d.style.opacity = "1";
		}
	}, timer ? timer : 0)
}

module.exports = {
	flashes,
	toast
}

function getElements (identifiant)
{
	let body = document.querySelector("body");
	let modal = document.getElementById(identifiant);
	let modalContent = document.querySelector("#" + identifiant + " .modal-content");
	let btns = document.querySelectorAll(".close-modal");

	return [body, modal, modalContent, btns];
}

function openM (body, modal, modalContent)
{
	body.style.overflow = "hidden";
	modal.style.zIndex = "10";
	modal.style.opacity = "1";
	modalContent.style.opacity = "1";
	modalContent.style.translateY = "0";
	modalContent.style.scale = "1";
}

function closeM (body, modal, modalContent)
{
	body.style.overflow = "auto";
	modal.style.zIndex = "-10";
	modal.style.opacity = "0";
	modalContent.style.opacity = "0";
	modalContent.style.translateY = "4";
	modalContent.style.scale = "0.95";
}

module.exports = {
	getElements,
	openM,
	closeM
}

function getElements (identifiant)
{
	let body = document.querySelector("body");
	let modal = document.getElementById(identifiant);
	let modalOverlay = document.querySelector("#" + identifiant + " > .modal-overlay");
	let modalContent = document.querySelector("#" + identifiant + " .modal-content");
	let btns = document.querySelectorAll(".close-modal");

	return [body, modal, modalOverlay, modalContent, btns];
}

function openM (body, modal, modalOverlay, modalContent)
{
	body.style.overflow = "hidden";
	modal.style.zIndex = "10";
	modal.style.opacity = "1";
	modalOverlay.style.opacity = "1";
	modalContent.style.opacity = "1";
	modalContent.style.translateY = "0";
	modalContent.style.scale = "1";
}

function closeM (body, modal, modalOverlay, modalContent)
{
	body.style.overflow = "auto";
	modal.style.zIndex = "-10";
	modal.style.opacity = "0";
	modalOverlay.style.opacity = "0";
	modalContent.style.opacity = "0";
	modalContent.style.translateY = "4";
	modalContent.style.scale = "0.95";
}

module.exports = {
	getElements,
	openM,
	closeM
}

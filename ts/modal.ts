const createModalContainer = () => {
	const container = document.createElement("div");
	container.className = "modalContainer container display-none";
	return container;
};
const createModalContentContainer = () => {
	const content = document.createElement("div");
	content.className = "modalContent";
	return content;
};

let modalContainer: Element;
let contentContainer: Element;

const closeModal = (callback: Function) => {
	contentContainer.classList.add("slideOut_rtl");
	setTimeout(() => {
		modalContainer.classList.add("display-none");
		contentContainer.classList.remove("slideOut_rtl");
		callback();
	}, 400);
};

export const init = () => {
	contentContainer = createModalContentContainer();
	modalContainer = createModalContainer();
	modalContainer.appendChild(contentContainer);
	document.querySelector("body")!.append(modalContainer);
};

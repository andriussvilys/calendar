const createModalContainer = () => {
	const container = document.createElement("div");
	container.classList = "modalContainer container display-none";
	return container;
};
const createModalContentContainer = () => {
	const content = document.createElement("div");
	content.classList = "modalContent";
	return content;
};

let modalContainer;
let contentContainer;

const showModal = () => {
	eventModal.classList.remove("display-none");
	contentContainer.classList.add("slideIn_ltr");
};

const closeModal = (callback) => {
	// resetForm();
	contentContainer.classList.add("slideOut_rtl");
	setTimeout(() => {
		modalContainer.classList.add("display-none");
		contentContainer.classList.remove("slideOut_rtl");
		callback();
	}, 400);
};

const addContent = (content) => {
	contentContainer.innerHtml = "";
	contentContainer.appendChild(content);
};

export const init = () => {
	contentContainer = createModalContentContainer();
	modalContainer = createModalContainer();
	modalContainer.appendChild(contentContainer);
	document.querySelector("body").append(modalContainer);
};

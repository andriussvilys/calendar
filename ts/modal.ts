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

// const showModal = () => {
// 	eventModal.classList.remove("display-none");
// 	contentContainer.classList.add("slideIn_ltr");
// };

const closeModal = (callback: Function) => {
	// resetForm();
	contentContainer.classList.add("slideOut_rtl");
	setTimeout(() => {
		modalContainer.classList.add("display-none");
		contentContainer.classList.remove("slideOut_rtl");
		callback();
	}, 400);
};

// const addContent = (content) => {
// 	contentContainer.innerHtml = "";
// 	contentContainer.appendChild(content);
// };

export const init = () => {
	contentContainer = createModalContentContainer();
	modalContainer = createModalContainer();
	modalContainer.appendChild(contentContainer);
	document.querySelector("body")!.append(modalContainer);
};

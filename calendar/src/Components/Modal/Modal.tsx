import { useRef, PropsWithChildren, useEffect } from "react";
import "./modal.css";

const slideInAnimation = "slideIn_ltr";
const slideOutAnimation = "slideOut_rtl";
const displayNone = "display-none";

const closeModal = (
	modalContent: HTMLElement | null,
	modalContainer: HTMLElement | null
) => {
	modalContent?.classList.add(slideOutAnimation);
	modalContent?.classList.remove(slideInAnimation);
	setTimeout(() => {
		modalContainer?.classList.add(displayNone);
	}, 400);
};
const openModal = (
	modalContent: HTMLElement | null,
	modalContainer: HTMLElement | null
) => {
	modalContent?.classList.remove(slideOutAnimation);
	modalContent?.classList.add(slideInAnimation);
	modalContainer?.classList.remove(displayNone);
};

interface ModalProps extends PropsWithChildren {
	isVisible: Boolean;
	setModalVisibility: Function;
}

const Modal = ({ children, isVisible, setModalVisibility }: ModalProps) => {
	const modalContent = useRef<HTMLDivElement>(null);
	const modalContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isVisible) {
			closeModal(modalContent.current, modalContainer.current);
			setModalVisibility(false);
		} else {
			openModal(modalContent.current, modalContainer.current);
			setModalVisibility(true);
		}
	}, [isVisible]);

	return (
		<div
			ref={modalContainer}
			id="eventCardModal"
			className={`modalContainer container display-none`}
			onClick={() => {
				closeModal(modalContent.current, modalContainer.current);
				setModalVisibility(false);
			}}
		>
			<div ref={modalContent} className="container modalInnerContainer">
				{children}
			</div>
		</div>
	);
};

export default Modal;

import { createRef, useRef, useState, PropsWithChildren } from "react";
import "./modal.css";

interface ModalProps extends PropsWithChildren {
	isVisible: Boolean;
	setModalVisibility: Function;
}

const Modal = ({ children, isVisible, setModalVisibility }: ModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null);

	const slideInAnimation = "slideIn_ltr";
	const slideOutAnimation = "slideOut_rtl";
	if (isVisible) {
		modalRef.current?.classList.remove(slideOutAnimation);
		modalRef.current?.classList.add(slideInAnimation);
	}

	return (
		<div
			id="eventCardModal"
			className={`modalContainer container ${isVisible ? "" : "display-none"}`}
			onClick={(e) => {
				console.log(modalRef.current);
				const animatableElement = modalRef.current;
				animatableElement?.classList.add(slideOutAnimation);
				setTimeout(() => {
					setModalVisibility(false);
				}, 400);
			}}
		>
			<div ref={modalRef} className="container eventCard">
				{children}
			</div>
		</div>
	);
};

export default Modal;

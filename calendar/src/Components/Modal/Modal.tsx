import { useRef, PropsWithChildren, useEffect } from "react";
import "./modal.css";

const slideInAnimation = "slideIn_ltr";
const slideOutAnimation = "slideOut_rtl";
const displayNone = "display-none";

interface ModalProps extends PropsWithChildren {
	isVisible: Boolean;
	setModalVisibility: Function;
}

const Modal = ({ children, isVisible, setModalVisibility }: ModalProps) => {
	const modalContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isVisible) {
			setTimeout(() => {
				modalContainer.current?.classList.add(displayNone);
			}, 400);
		} else {
			modalContainer.current?.classList.remove(displayNone);
		}
	}, [isVisible]);

	return (
		<div
			ref={modalContainer}
			id="eventCardModal"
			className={`modalContainer container display-none`}
			onClick={(e) => {
				setModalVisibility(false);
			}}
		>
			<div
				className={`container modalInnerContainer ${
					isVisible ? slideInAnimation : slideOutAnimation
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
};

export default Modal;

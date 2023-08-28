import {
	useRef,
	PropsWithChildren,
	useEffect,
	Fragment,
	useState,
} from "react";
import "./modal.css";

const slideInAnimation = "slideIn_ltr";
const slideOutAnimation = "slideOut_rtl";
const displayNone = "display-none";

export interface ModalProps extends PropsWithChildren {
	isVisible: boolean;
	setModalVisibility: (value: boolean) => void;
}

const Modal = ({ children, isVisible, setModalVisibility }: ModalProps) => {
	const [toBeRendered, setToBeRendered] = useState<boolean>(isVisible);

	const modalContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isVisible) {
			setTimeout(() => {
				setToBeRendered(false);
			}, 400);
		} else {
			setToBeRendered(true);
			modalContainer.current?.classList.remove(displayNone);
		}
	}, [isVisible]);

	return (
		<Fragment>
			{toBeRendered ? (
				<div
					ref={modalContainer}
					className={`modalContainer`}
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
			) : null}
		</Fragment>
	);
};

export default Modal;

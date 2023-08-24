import {
	Fragment,
	PropsWithChildren,
	ReactNode,
	createContext,
	useState,
} from "react";
import Modal, { ModalProps } from "./Modal";
import { FormData } from "../../Utils/database";

type NewType = FormData;

interface OpenModalProps {
	id: string;
	data: FormData | Date;
}

interface ModalContextProps {
	setModalChildren: (children: ReactNode | null) => void;
	setModalVisibility: (value: boolean) => void;
}

const modalContextProps: ModalContextProps = {
	setModalVisibility: () => {},
	setModalChildren: () => {},
};
export const ModalContext = createContext(modalContextProps);

export const ModalContextProvider = ({ children }: PropsWithChildren) => {
	const [isModalVisible, setIsVisible] = useState<boolean>(false);
	const [modalChildren, setChildren] = useState<ReactNode | null>(null);

	const setModalVisibility = (value: boolean): void => {
		setIsVisible(value);
	};
	const setModalChildren = (value: ReactNode | null): void => {
		setChildren(value);
	};

	return (
		<Fragment>
			<ModalContext.Provider
				value={{
					setModalVisibility,
					setModalChildren,
				}}
			>
				{children}
			</ModalContext.Provider>
			<Modal isVisible={isModalVisible} setModalVisibility={setModalVisibility}>
				{modalChildren}
			</Modal>
		</Fragment>
	);
};

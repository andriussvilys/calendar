import { useState } from "react";

const useModal = (
	initialValue: boolean
): [boolean, (value: boolean) => void] => {
	const [isVisible, setIsModalVisible] = useState<boolean>(initialValue);
	const setModal = (value: boolean): void => {
		setIsModalVisible(value);
	};
	return [isVisible, setModal];
};

export default useModal;

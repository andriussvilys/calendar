import { useState } from "react";

const useModalVisible = (
	initialValue: boolean
): [boolean, (value: boolean) => void] => {
	const [isVisible, setIsVisible] = useState<boolean>(initialValue);

	function toggle(value: boolean) {
		setIsVisible(value);
	}

	return [isVisible, toggle];
};

export default useModalVisible;

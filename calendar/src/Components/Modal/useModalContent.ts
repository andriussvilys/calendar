import { useState } from "react";

type ModalContent = JSX.Element | null;

const useModalContent = (
	initialValue: ModalContent
): [ModalContent, (value: ModalContent) => void] => {
	const [content, setContent] = useState<ModalContent>(initialValue);

	function changeContent(value: ModalContent) {
		console.log("change Content");
		setContent(value);
	}

	return [content, changeContent];
};

export default useModalContent;

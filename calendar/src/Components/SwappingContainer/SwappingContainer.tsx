import {
	PropsWithChildren,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import "./SwappingContainer.css";

export type direction = -1 | 0 | 1;
interface SwappingContainerProps extends PropsWithChildren {
	direction: direction;
}

const slideIn_ltr = "slideIn_ltr";
const slideIn_rtl = "slideIn_rtl";

const SwappingContainer = ({ children, direction }: SwappingContainerProps) => {
	const directionAnimation = {
		"-1": slideIn_rtl,
		"1": slideIn_ltr,
		"0": null,
		"-0": null,
	};
	const [prevElement, setPrevElement] = useState<ReactNode | null>(null);
	const [prevTimeout, setPrevTimeout] = useState<number | null>(null);

	const prev = useRef<ReactNode>(null);
	const slider = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (directionAnimation[direction]) {
		}
	}, [children]);

	return (
		<div className={`swappingContainer`}>
			<div ref={slider} className={`slider`}>
				{children}
			</div>
		</div>
	);
};

export default SwappingContainer;

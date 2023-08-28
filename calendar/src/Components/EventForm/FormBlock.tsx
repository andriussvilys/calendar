import { PropsWithChildren, ReactNode } from "react";

interface FormBlockProps extends PropsWithChildren {
	icon: ReactNode | null;
}

const FormBlock = ({ children, icon }: FormBlockProps) => {
	return (
		<div className="container">
			<div className="event-left">{icon}</div>
			<div className="event-right">{children}</div>
		</div>
	);
};

export default FormBlock;

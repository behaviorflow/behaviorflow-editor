import React, { useState } from "react";
import "./simple-symbol-button.css"

interface SimpleSymbolButtonProps {
	onClick: () => void;
	buttonName: string;
	symbol: React.ReactNode;
	isActive?: boolean;
}

export default function SimpleSymbolButton({ onClick, buttonName, symbol, isActive = true }: SimpleSymbolButtonProps) {
	const onClickHandler = () => {
		if (isActive) {
			onClick();
		}
	}
	return (
		<button className={`simple-symbol-button ${isActive ? 'active' : ''}`}
			onClick={onClickHandler}
			title={buttonName}>
			{React.isValidElement(symbol)
				? React.cloneElement(symbol as React.ReactElement, { size: 18 })
				: symbol}
		</button>
	);
}

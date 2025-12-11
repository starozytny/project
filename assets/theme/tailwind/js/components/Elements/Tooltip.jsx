import React from "react";

import { cn } from "@shadcnComponents/lib/utils";

import Classnames from "@commonFunctions/classnames";

export function Tooltip ({ children, content, classname, onClick, tooltipClass = "group-hover:opacity-100 group-hover:z-10" }) {
	return <div className={cn("relative group", classname)} onClick={onClick}>
		{children}
		<div className={Classnames.getTooltipClass(tooltipClass)}>{content}</div>
	</div>
}

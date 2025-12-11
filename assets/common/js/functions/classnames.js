const { cn } = require("@shadcnComponents/lib/utils")

function getItemListClass (highlight) {
	return cn(
		"item border-t [&:last-child]:rounded-b-md [&:nth-child(2)]:border-0 lg:[&:nth-child(2)]:border-t hover:bg-slate-50",
		highlight ? "highlight" : ""
	)
}

function getTooltipClass (className) {
	return cn(
		"bg-black/90 text-white py-1 px-2 rounded absolute -top-7 -left-2 text-xs opacity-0 -z-10 transition-opacity",
		className
	)
}

module.exports = {
	getItemListClass,
	getTooltipClass,
}

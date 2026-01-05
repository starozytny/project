import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@shadcnComponents/ui/select";

export function SelectSimple({ identifiant, valeur, items, onSelect, placeholder, btnClassName, withGroup, noEmpty, open, onOpenChange }) {
	return <Select value={valeur} onValueChange={(value) => onSelect(identifiant, value)} open={open} onOpenChange={onOpenChange}>
		<SelectTrigger className={cn("w-full min-w-16 focus:ring-0 justify-between h-9 font-normal px-3 hover:bg-gray-50", btnClassName)}>
			<SelectValue placeholder={placeholder} />
		</SelectTrigger>
		<SelectContent>
			{!noEmpty
				? <SelectItem value={null}>&nbsp;</SelectItem>
				: null
			}
			{items.map((choice, index) => {
				if(withGroup) {
					return <SelectGroup key={index}>
						<SelectLabel>{choice.label}</SelectLabel>
						{choice.data.map(item => {
							return <SelectItem value={item.value} key={item.identifiant}>{item.label}</SelectItem>
						})}
					</SelectGroup>
				}else{
					return <SelectItem value={choice.value} key={choice.identifiant}>{choice.label}</SelectItem>
				}
			})}
		</SelectContent>
	</Select>
}

import * as React from "react"

import { cn } from "@shadcnComponents/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@shadcnComponents/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@shadcnComponents/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@shadcnComponents/ui/command";

function BtnValue ({ valeur, items, placeholder, withInput }) {
    return <>
        {valeur
            ? (items.find((choice) => choice.value === valeur)?.label) ?? (withInput ? valeur : <span>Erreur</span>)
            : (placeholder ? <span className="text-gray-400 text-xs">{placeholder}</span> : <span>&nbsp;</span>)
        }
        <ChevronsUpDown className="opacity-50" />
    </>
}

export function ComboboxSimple({ identifiant, valeur, items, onSelect, placeholder, btnClassName, listClassName, disabled, onChange, withInput }) {
    const [inputValue, setInputValue] = React.useState("")
    const [open, setOpen] = React.useState(false)

    const inputIdentifiant = "input-select-" + identifiant;

    const handleChange = (e) => {
        setInputValue(onChange ? onChange(e) : e.currentTarget.value);
    }

    const handleKeyDown = (e) => {
        if(e.keyCode === 13 || e.keyCode === 9){
            if(inputValue.trim() !== ""){
                setInputValue("")
                onSelect(identifiant, inputValue);
                setOpen(false);
            }
        }
    }

    const handleAdd = (e) => {
        e.preventDefault();

        let input = document.getElementById(inputIdentifiant);
        if(input && input.value.trim() !== "") {
            setInputValue("")
            onSelect(identifiant, input.value);
        }
    }

    let iniBtnClassName = "w-full justify-between h-9 font-normal px-3 text-black focus-visible:ring-0";

    if(disabled){
        return (
            <div className="cursor-not-allowed">
                <Button
                    disabled
                    variant="outline"
                    className={cn(iniBtnClassName, btnClassName)}
                >
                    <BtnValue valeur={valeur} items={items} placeholder={placeholder} withInput={withInput} />
                </Button>
            </div>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(iniBtnClassName, "hover:bg-gray-50", btnClassName)}
                >
                    <BtnValue valeur={valeur} items={items} placeholder={placeholder} withInput={withInput} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                {withInput
                    ? <div className="flex items-stretch justify-between">
                        <div className="w-full">
                            <input type="text" name={inputIdentifiant} id={inputIdentifiant} value={inputValue}
                                   placeholder="Saisir un nouveau élément" onChange={handleChange} onKeyDown={handleKeyDown}
                                   className="w-full block rounded-md shadow-sm border-0 py-2 px-3 text-sm text-gray-900 ring-b-1 ring-gray-600 placeholder:text-gray-400 placeholder:text-xs focus:ring-0" />
                        </div>
                        <div className="flex items-center justify-center px-2 cursor-pointer text-gray-600 hover:text-black" onClick={(e) => handleAdd(e)}>
                            <span className="icon-add"></span>
                        </div>
                    </div>
                    : null
                }

                <Command className={listClassName}>
                    <CommandInput placeholder="Recherche..." className="h-11 py-3 focus-visible:ring-0 border-0" />
                    <CommandList>
                        <CommandEmpty>Aucun résultat.</CommandEmpty>
                        <CommandGroup>
                            {items.map((choice) => (
                                <CommandItem
                                    key={choice.value}
                                    value={choice.value}
                                    onSelect={(currentValue) => {
                                        onSelect(identifiant, choice.value === valeur ? "" : choice.value)
                                        setOpen(false)
                                    }}
                                >
                                    {choice.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            valeur === choice.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

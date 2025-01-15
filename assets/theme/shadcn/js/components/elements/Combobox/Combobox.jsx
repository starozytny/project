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

export function ComboboxMultiple({ identifiant, valeurs, items, onSelect, placeholder, btnClassName, onChange, withInput, withItems }) {
    const [inputValue, setInputValue] = React.useState("")
    const [open, setOpen] = React.useState(false)

    const inputIdentifiant = "input-select-multiple-" + identifiant;

    const handleChange = (e) => {
        setInputValue(onChange ? onChange(e) : e.currentTarget.value);
    }

    const handleKeyDown = (e) => {
        if(e.keyCode === 13 || e.keyCode === 9){
            if(inputValue.trim() !== ""){
                setInputValue("")
                onSelect(identifiant, { value: inputValue, label: inputValue });
                setOpen(false);
            }
        }
    }

    const handleDel = (e, val) => {
        e.preventDefault();
        onSelect(identifiant, val);
        setOpen(false);
    }

    const handleAdd = (e) => {
        e.preventDefault();

        let input = document.getElementById(inputIdentifiant);
        if(input && input.value.trim() !== "") {
            setInputValue("")
            onSelect(identifiant, { value: input.value, label: input.value });
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between min-h-9 h-auto font-normal px-3 hover:bg-gray-50 text-sm focus-visible:ring-0"
                        , btnClassName
                    )}
                >
                    {valeurs
                        ? <div className="flex flex-wrap gap-1">
                            {valeurs.map((val, index) => {
                                return <div className="flex items-stretch border border-color1-o-4 rounded-md" key={index}>
                                    <span className="bg-color1-o-4/20 rounded-l-sm py-0.5 pl-2 pr-1.5">{val.inputName ? val.inputName : val.label}</span>
                                    <div onClick={(e) => handleDel(e, val)} className="flex items-center justify-center bg-color1-o-4/20 rounded-r-sm  py-0.5 px-1.5 hover:bg-color1-o-4/10 transition-colors">
                                        <span className="icon-close !text-xs"></span>
                                    </div>
                                </div>
                            })}
                        </div>
                        : (placeholder ? placeholder : <span>&nbsp;</span>)
                    }
                    <ChevronsUpDown className="opacity-50" />
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
                <Command>
                    {items.length > 10
                        ? <CommandInput placeholder="Recherche..." className="h-11 py-3 focus-visible:ring-0 border-0" />
                        : null
                    }
                    {withItems
                        ? <CommandList>
                            <CommandEmpty>Aucun résultat.</CommandEmpty>
                            <CommandGroup>
                                {items.map((choice) => (
                                    <CommandItem
                                        key={choice.value}
                                        value={choice.value}
                                        onSelect={(currentValue) => {
                                            onSelect(identifiant, choice)
                                        }}
                                    >
                                        {choice.label}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                valeurs.some(v => v.value === choice.value) ? "opacity-100" : "opacity-0",
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        : null
                    }

                </Command>
            </PopoverContent>
        </Popover>
    )
}

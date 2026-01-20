import * as React from "react"

import { cn } from "@shadcnComponents/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@shadcnComponents/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@shadcnComponents/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@shadcnComponents/ui/command";

function BtnValue ({ valeur, items, placeholder, withInput }) {
    return <>
        {valeur !== "" && valeur !== null
            ? (items.find((choice) => choice.value === valeur)?.label) ?? (withInput ? valeur : <span>Erreur</span>)
            : (placeholder ? <span className="text-gray-400 text-xs">{placeholder}</span> : <span>&nbsp;</span>)
        }
        <ChevronsUpDown className="opacity-50" />
    </>
}

export function ComboboxSimple({ identifiant, valeur, items, onSelect, placeholder, btnClassName, listClassName, disabled, onChange, withInput }) {
    const [inputValue, setInputValue] = React.useState("")
    const [open, setOpen] = React.useState(false)

    const handleKeyDown = (e) => {
        if(e.keyCode === 13 || e.keyCode === 9){
            if(inputValue.trim() !== ""){
                onSelect(identifiant, inputValue);
                setInputValue("")
                setOpen(false);
            }
        }
    }

    const handleAdd = (e) => {
        e.preventDefault();

        onSelect(identifiant, inputValue);
        setInputValue("");
        setOpen(false);
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
                <Command className={listClassName}>
                    <div className="w-full flex items-center">
                        <CommandInput
                            placeholder={withInput ? "Rechercher ou ajouter..." : "Recherche..."}
                            className="w-full h-11 py-3 focus-visible:ring-0 border-0 flex-1"
                            value={inputValue}
                            onValueChange={setInputValue}
                            onKeyDown={withInput ? handleKeyDown : undefined}
                        />
                        {withInput && inputValue && (
                            <div
                                className="w-10 h-11 border-b flex items-center justify-center px-3 cursor-pointer text-gray-600 hover:text-black"
                                onClick={(e) => handleAdd(e)}
                            >
                                <span className="icon-add"></span>
                            </div>
                        )}
                    </div>
                    <CommandList>
                        <CommandEmpty>
                            {withInput
                                ? <div className="text-gray-600 text-xs">
                                    {inputValue !== ""
                                        ? <div>Appuyez sur <span className="font-semibold">Entrée</span> pour ajouter "{inputValue}"</div>
                                        : <div>Aucun résultat.</div>
                                    }
                                </div>
                                : "Aucun résultat."
                            }
                        </CommandEmpty>
                        <CommandGroup>
                            {items.map((choice) => (
                                <CommandItem
                                    key={choice.value}
                                    value={choice.value + " " + choice.label}
                                    onSelect={(currentValue) => {
                                        onSelect(identifiant, choice.value === valeur ? "" : choice.value)
                                        setOpen(false)
                                    }}
                                >
                                    {choice.customLabelList
                                        ? <div dangerouslySetInnerHTML={{ __html: choice.customLabelList }}></div>
                                        : choice.label
                                    }
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

export function ComboboxMultiple({ identifiant, valeurs, items, onSelect, placeholder, btnClassName, onChange, withInput, withItems, onlyValue }) {
    const [inputValue, setInputValue] = React.useState("")
    const [open, setOpen] = React.useState(false)

    const handleKeyDown = (e) => {
        if(e.keyCode === 13 || e.keyCode === 9){
            if(inputValue.trim() !== ""){
                onSelect(identifiant, { value: inputValue, label: inputValue });
                setInputValue("")
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

        onSelect(identifiant, { value: inputValue, label: inputValue });
        setInputValue("")
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
                        , valeurs && valeurs.length > 0 ? "" : "h-9"
                        , btnClassName
                    )}
                >
                    {valeurs && valeurs.length > 0
                        ? <div className="flex flex-wrap gap-1">
                            {valeurs.map((val, index) => {

                                let valeurLabel = onlyValue ? val : val.inputName ? val.inputName : val.label;
                                let valeurItem = null;
                                items.forEach(it => {
                                    if(it.value === (onlyValue ? val : val.value)){
                                        valeurLabel = it.label;
                                        valeurItem = it;
                                    }
                                })

                                return <div className="flex items-stretch border border-color1-o-4 rounded-md" key={index}>
                                    <span className="bg-white rounded-l-sm py-0.5 pl-2 pr-1.5">{valeurLabel}</span>
                                    <div onClick={(e) => handleDel(e, onlyValue ? valeurItem : val)} className="flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-r-sm py-0.5 px-1.5 transition-colors">
                                        <span className="icon-close !text-xs"></span>
                                    </div>
                                </div>
                            })}
                        </div>
                        : (placeholder ? <span className="text-sm text-gray-400">{placeholder}</span> : <span>&nbsp;</span>)
                    }
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <Command>
                    {items.length > 10 || withInput
                        ? <div className="w-full flex items-center">
                            <CommandInput
                                placeholder={withInput ? "Rechercher ou ajouter..." : "Recherche..."}
                                className="w-full h-11 py-3 focus-visible:ring-0 border-0 flex-1"
                                value={inputValue}
                                onValueChange={setInputValue}
                                onKeyDown={withInput ? handleKeyDown : undefined}
                            />
                            {withInput && inputValue && (
                                <div
                                    className="w-10 h-11 border-b flex items-center justify-center px-3 cursor-pointer text-gray-600 hover:text-black"
                                    onClick={(e) => handleAdd(e)}
                                >
                                    <span className="icon-add"></span>
                                </div>
                            )}
                        </div>
                        : null
                    }
                    {withItems
                        ? <CommandList>
                            <CommandEmpty>
                                {withInput
                                    ? <div className="text-gray-600 text-xs">
                                        {inputValue !== ""
                                            ? <div>Appuyez sur <span className="font-semibold">Entrée</span> pour ajouter "{inputValue}"</div>
                                            : <div>Aucun résultat.</div>
                                        }
                                    </div>
                                    : "Aucun résultat."
                                }
                            </CommandEmpty>
                            <CommandGroup>
                                {items.map((choice) => (
                                    <CommandItem
                                        key={choice.value}
                                        value={choice.value + " " + choice.label}
                                        onSelect={(currentValue) => {
                                            onSelect(identifiant, choice)
                                        }}
                                    >
                                        {choice.label}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                valeurs.some(v => (onlyValue ? v : v.value) === choice.value) ? "opacity-100" : "opacity-0",
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

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { copyToClipboard, FormSchema, generateBranchName, getPrefixDesc, prefixOptions } from "./helper"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl, FormDescription, FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

export default function JiraBranchCreator() {
    const [branchValue, setBranchValue] = useState("")
    const [prefixDesc, setPrefixDesc] = useState("")
    const [btnValue, setBtnValue] = useState("Copy")

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            inputString: "",
            removeString: "",
            skipLowercase: "",
            addPrefix: "",
        },
    })

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const branchValue = generateBranchName(data)
        setBranchValue(branchValue ?? '')
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="inputString"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter String</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Implement a form" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 xl:col-span-6 2xl:col-span-6">
                        <FormField
                            control={form.control}
                            name="removeString"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Remove Substrings (comma-separated):</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. FE, BE, DEV" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-12 xl:col-span-6 2xl:col-span-6">
                        <FormField
                            control={form.control}
                            name="skipLowercase"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Skip Lowercase for:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. MLX, JIR" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 xl:col-span-6 2xl:col-span-6">
                        <FormField
                            control={form.control}
                            name="addPrefix"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Add Prefix:</FormLabel>
                                    <Select
                                        onValueChange={(value: string) => {
                                            field.onChange(value)
                                            setPrefixDesc(getPrefixDesc(value ?? ''))
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {prefixOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>{option.Label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>{prefixDesc}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit">Generate</Button>

                {branchValue && (
                    <div className="flex p-2 bg-slate-200 rounded-sm">
                        <div className="flex flex-1 col-span-9 items-center">
                            <p className="text-slate-600">{branchValue}</p>
                        </div>
                        <Button onClick={() => copyToClipboard(branchValue, setBtnValue)} type="button">{btnValue}</Button>
                    </div>
                )}
            </form>
        </Form>
    )
}
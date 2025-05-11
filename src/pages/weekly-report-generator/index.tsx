import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormSchema, generateReport } from "./helper";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Anthropic from "@anthropic-ai/sdk";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import MarkdownViewer from "@/components/custom/markdown-viewer";

export default function WeeklyReportGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<string>();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            anthropicApiKey: "",
            taskLog: "",
        },
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        generateReport(data)
            .then((response: Anthropic.Messages.Message) => {
                const parsedResponse = response?.content?.map((item: Anthropic.Messages.ContentBlock) => (item as Anthropic.Messages.TextBlock).text);
                setReport(parsedResponse ? parsedResponse.join('') : '');
            })
            .finally(() => {
                console.log("finally");
                setIsLoading(false);
            });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="anthropicApiKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Anthropic API Key</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Get you key from&nbsp;
                                        <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
                                            <span className="underline decoration-pink-500 animate-pulse">here</span>
                                        </a>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="taskLog"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Log</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Type your message here." cols={50} rows={24} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="animate-spin me-2" size={16} />}
                            {isLoading ? "Generating..." : "Generate"}
                        </Button>
                    </div>

                    <div className="col-span-2 space-y-2">
                        <MarkdownViewer markdownContent={report} isLoading={isLoading} />
                    </div>
                </div>


            </form>
        </Form>
    );
}

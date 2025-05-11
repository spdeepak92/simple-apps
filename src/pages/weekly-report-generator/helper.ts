import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

export const FormSchema = z.object({
    anthropicApiKey: z.string().min(5, {
        message: "Entered API key is invalid.",
    }),
    taskLog: z.string(),
});

export const generateReport = async (data: z.infer<typeof FormSchema>) => {
    const anthropic = new Anthropic({
        // defaults to process.env["ANTHROPIC_API_KEY"]
        apiKey: data.anthropicApiKey,
        dangerouslyAllowBrowser: true,
    });

    const msg = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1000,
        temperature: 0,
        system: "This template is used to generate **weekly reports** summarizing completed tasks, tasks in progress, challenges faced, and the upcoming week’s plan. The structure is as follows:\n\n#### **1. Tasks Completed**\nEach completed task includes:\n- **Task ID & Title** – The Jira ticket number (e.g., MLX-3063) and a brief title.\n- **Description** – A short summary of the work done.\n- **Estimated Time** – The originally estimated time for completion (in points or hours).\n- **Time Spent** – The actual hours spent.\n- **EASE Time Tracking** – Logged time in the EASE tracking system.\n\n#### **2. Tasks In Progress**\nThis section lists tasks that are still being worked on, formatted similarly to the **Tasks Completed** section.\n\n#### **3. Challenges Faced**\nA brief list of obstacles encountered during development, bug fixes, or requirement analysis.\n\n#### **4. Next Week’s Plan**\nA list of planned tasks or priorities for the upcoming week.\n\n---\n\nExample Report Generated Using the Template\n\nWeekly Report\n\nTasks Completed:\n1. MLX-3078 - View Availability Dropdown Position Fix\n    * Description: Fixed the issue where the 'Select Users' dropdown list was misaligned when opened for the first time.\n    * Estimated Time: 6-8 hours\n    * Time Spent: 7.5 hrs\n    * EASE Time Tracking: 7.5 hrs\n---\nTasks In Progress:\n1. MLX-3063 - Update Labels on Calendar Cards and Implement Overlay Popups\n    * Description: Updating calendar card labels and implementing overlay popups for better usability.\n    * Estimated Time: 6-8 hours\n    * Time Spent: 5.5 hrs\n    * EASE Time Tracking: 5.5 hrs\n---\nChallenges Faced:\n    * Dropdown rendering inconsistencies due to conflicting CSS styles.\n    * Overlay popups required additional accessibility considerations.\n---\nNext Week’s Plan:\n    * Complete UI refinements for MLX-3063.\n    * Implement reordering of sub-menus under the schedule section.\n    * Conduct development testing for all completed tasks.\n---\n\nill be simply provide the task list (with IDs, descriptions, and time spent), and ChatGPT will format it into this structure. You can reuse this context whenever you request a report. Also if same task group them together and calculate as one, e.g. mettings and should come under task's completed. Make sure to match the answer with template provieded including ordered list. i.e. estimated time, time spent, ease time tracking, challenges faced and Next Week's Plan should be a list coming under each task list.\nNo need for Time Spent: 10.5 hrs (06:30:00 on 29 Apr + 04:00:00 on 06 May), individual timing, just total is enough ",
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": JSON.stringify(data.taskLog ?? "")
                    }
                ]
            }
        ]
    });

    return msg;
}
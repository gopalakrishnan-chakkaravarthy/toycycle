"use server";

/**
 * @fileOverview Generates a personalized impact report for ToyCycle users.
 *
 * - generateImpactReport - A function that generates the impact report.
 * - GenerateImpactReportInput - The input type for the generateImpactReport function.
 * - GenerateImpactReportOutput - The return type for the generateImpactReport function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateImpactReportInputSchema = z.object({
  userId: z
    .string()
    .describe("The ID of the user requesting the impact report."),
  toysRedistributed: z
    .number()
    .describe("The total number of toys redistributed by ToyCycle."),
  environmentalImpact: z
    .string()
    .describe(
      "A summary of the environmental impact of ToyCycle, e.g., reduction in landfill waste."
    ),
  smilesCreated: z
    .number()
    .describe("The estimated number of smiles created by ToyCycle."),
  userDonations: z
    .number()
    .optional()
    .describe("The number of donations a user has made, if available."),
});
export type GenerateImpactReportInput = z.infer<
  typeof GenerateImpactReportInputSchema
>;

const GenerateImpactReportOutputSchema = z.object({
  impactReport: z
    .string()
    .describe("A personalized impact report for the user."),
});
export type GenerateImpactReportOutput = z.infer<
  typeof GenerateImpactReportOutputSchema
>;

export async function generateImpactReport(
  input: GenerateImpactReportInput
): Promise<GenerateImpactReportOutput> {
  return generateImpactReportFlow(input);
}

const prompt = ai.definePrompt({
  name: "generateImpactReportPrompt",
  input: { schema: GenerateImpactReportInputSchema },
  output: { schema: GenerateImpactReportOutputSchema },
  model: ai.model,
  prompt: `You are an impact report generator for ToyCycle, which collects, sanitizes, and redistributes unused kids' toys and accessories.

  Generate a personalized impact report for user {{userId}} based on the following information:

  Total Toys Redistributed: {{toysRedistributed}}
  Environmental Impact: {{environmentalImpact}}
  Smiles Created: {{smilesCreated}}
  {{#if userDonations}}
    User Donations: {{userDonations}}
  {{/if}}

  Highlight the most impactful data points and present the information in a positive and engaging manner.
  The report should be concise and easy to understand.
  Focus on how ToyCycle's activities and the user's donations are making a difference.
  Be sure to quantify the impact whenever possible.  If a user has donations, thank them specifically for their contributions.

  Example report:
  "Thanks to ToyCycle, we've redistributed {{toysRedistributed}} toys, reducing landfill waste and creating {{smilesCreated}} smiles!  Our environmental impact includes {{environmentalImpact}}.  {{#if userDonations}}Thank you for your {{userDonations}} donations which contributed to this impact.{{/if}}"
  `,
});

const generateImpactReportFlow = ai.defineFlow(
  {
    name: "generateImpactReportFlow",
    inputSchema: GenerateImpactReportInputSchema,
    outputSchema: GenerateImpactReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

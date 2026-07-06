import { z } from 'zod';

export const Step1Schema = z.object({
    legalName: z.string().min(2, "Legal name must be at least 2 characters"),
    creatorName: z.string().min(2, "Creator name must be at least 2 characters"),
    ethnicGroup: z.string().min(2, "Please specify your ethnic group or community"),
    phone: z.string().min(8, "Please enter a valid phone number"),
    email: z.string().email("Please enter a valid email address"),
});

export const Step2Schema = z.object({
    languages: z.string().min(2, "Please list the languages you use"),
    experienceTime: z.string().min(1, "Please specify your experience time"),
    bio: z.string().min(20, "Bio should be at least 20 characters").max(500, "Bio is too long"),
});

export const Step3Schema = z.object({
    portfolioLinks: z.array(z.string().url("Please enter a valid URL")).min(1, "At least one portfolio link is required"),
    // If we follow the "3 recordings" requirement from screenshot:
    recordings: z.array(z.object({
        file: z.any().optional(), // For client-side handling
        url: z.string().url("Invalid recording URL").optional(),
        title: z.string().min(2, "Title is required"),
        description: z.string().min(5, "Description is required"),
        significance: z.string().min(5, "Significance is required"),
    })).min(3, "At least 3 recordings are required"),
});

export const Step4Schema = z.object({
    idDocument: z.any().refine((file) => file !== null, "ID document is required"),
    endorsements: z.any().optional(),
});

export const WizardSchema = z.object({
    step1: Step1Schema,
    step2: Step2Schema,
    step3: Step3Schema,
    step4: Step4Schema,
});

import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  category: z.string().trim().min(2, "Category must be selected"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  thumbnail: z.string().trim().url("Invalid thumbnail URL format"),
});

export const saveModulesSchema = z.object({
  modules: z.array(
    z.object({
      moduleName: z.string().trim().min(1, "Module name cannot be left blank"),
      videos: z.array(
        z.object({
          videoTitle: z.string().trim().min(1, "Video title is required"),
          videoUrl: z.string().trim().url("Must be a valid URL (include http:// or https://)"),
          questions: z.array(
            z.object({
              question: z.string().trim().min(1, "Question text cannot be empty"),
              optionA: z.string().trim().min(1, "Option A configuration required"),
              optionB: z.string().trim().min(1, "Option B configuration required"),
              optionC: z.string().trim().min(1, "Option C configuration required"),
              optionD: z.string().trim().min(1, "Option D configuration required"),
              correctAnswer: z.enum(["A", "B", "C", "D"]),
            })
          ),
        })
      ),
    })
  ),
});

export type CourseValues = z.infer<typeof createCourseSchema>;
export type SaveModulesValues = z.infer<typeof saveModulesSchema>;
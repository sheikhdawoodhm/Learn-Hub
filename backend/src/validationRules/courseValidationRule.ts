import { z } from "zod";

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    category: z.string().trim().min(2, "Category must be at least 2 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    thumbnail: z.string().trim().pipe(z.url("Invalid thumbnail URL format")),
  }),
});

export const saveModulesSchema = z.object({
  params: z.object({
courseId: z.string().min(1, "Course ID path parameter is required"),  }),
  body: z.object({
    modules: z.array(
      z.object({
        moduleName: z.string().trim().min(1, "Module name cannot be left blank"),
        videos: z.array(
          z.object({
            videoTitle: z.string().trim().min(1, "Video title is required"),
            videoUrl: z.string().trim().url("Invalid lesson video URL format"),
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
  }),
});



export const getCoursesQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => parseInt(val || "1", 10)).pipe(z.number().min(1)),
    limit: z.string().optional().transform((val) => parseInt(val || "6", 10)).pipe(z.number().min(1).max(100)),
    search: z.string().optional().default(""),
    category: z.string().optional().default("All"),
    status: z.string().optional().default("All"),
  }),
});


export type GetCoursesQueryInput = z.infer<typeof getCoursesQuerySchema>["query"];
export type CreateCourseInput = z.infer<typeof createCourseSchema>["body"];
export type SaveModulesInput = z.infer<typeof saveModulesSchema>["body"];
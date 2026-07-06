import * as moduleQueries from "../queries/moduleQueries";

export const getModulesByCourse = async (courseId: number) => {
  return await moduleQueries.selectModulesByCourseId(courseId);
};

export const createModule = async (courseId: number, title: string, moduleOrder: number) => {
  return await moduleQueries.insertModule(courseId, title, moduleOrder);
};

export const updateModule = async (id: number, title: string, moduleOrder: number) => {
  return await moduleQueries.updateModuleById(id, title, moduleOrder);
};

export const removeModule = async (id: number) => {
  await moduleQueries.deleteModuleById(id);
};

export const getSyllabusModules = async (courseId: number) => {
  if (!courseId) throw new Error("BAD_REQUEST: Missing course ID");
  return await moduleQueries.fetchSyllabusByCourseId(courseId);
};
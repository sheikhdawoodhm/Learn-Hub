import * as CertificateQueries from "../queries/certificateQueries";

export const getCertificate = async (userId: number, courseId: number) => {
  return await CertificateQueries.getCertificateByUserAndCourse(userId, courseId);
};

export const generateCertificate = async (userId: number, courseId: number) => {
  // Check if already exists
  const existing = await CertificateQueries.getCertificateByUserAndCourse(userId, courseId);
  if (existing) {
    return existing;
  }

  // Check completion
  const { totalVideos, completedVideos } = await CertificateQueries.checkCourseCompletion(userId, courseId);
  
  if (totalVideos > 0 && completedVideos >= totalVideos) {
    // Generate a dummy URL or ID
    const certificateUrl = `/certificates/${courseId}-${userId}-${Date.now()}`;
    const newCert = await CertificateQueries.createCertificate(userId, courseId, certificateUrl);
    return newCert || await CertificateQueries.getCertificateByUserAndCourse(userId, courseId);
  }

  throw new Error("Course not completed yet.");
};

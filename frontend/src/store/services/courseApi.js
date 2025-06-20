import httpClient from "../../services/httpClient";

const courseApi = {
  getAllCourses: async () => {
    return await httpClient.get("/courses");
  },

  getCourseById: async (id) => {
    return await httpClient.get(`/courses/${id}`);
  },

  createCourse: async (courseData) => {
    return await httpClient.post("/courses", courseData);
  },

  updateCourse: async (id, courseData) => {
    return await httpClient.put(`/courses/${id}`, courseData);
  },

  deleteCourse: async (id) => {
    return await httpClient.delete(`/courses/${id}`);
  },

  getCategories: async () => {
    return await httpClient.get("/courses/categories/all");
  },
};

export { courseApi };

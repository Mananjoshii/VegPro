import api from "./api";

/**
 * Admin management API service.
 */
const adminService = {
  async getAll() {
    const response = await api.get("/admins");
    return response.data.data;
  },

  async create(data) {
    const response = await api.post("/admins", data);
    return response.data.data;
  },

  async update(id, data) {
    const response = await api.put(`/admins/${id}`, data);
    return response.data.data;
  },

  async delete(id) {
    const response = await api.delete(`/admins/${id}`);
    return response.data.data;
  },
};

export default adminService;

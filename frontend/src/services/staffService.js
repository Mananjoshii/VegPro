import api from "./api";

/**
 * Staff management API service.
 */
const staffService = {
  async getAll() {
    const response = await api.get("/staff");
    return response.data.data;
  },

  async create(data) {
    const response = await api.post("/staff", data);
    return response.data.data;
  },

  async update(id, data) {
    const response = await api.put(`/staff/${id}`, data);
    return response.data.data;
  },

  async delete(id) {
    const response = await api.delete(`/staff/${id}`);
    return response.data.data;
  },
};

export default staffService;

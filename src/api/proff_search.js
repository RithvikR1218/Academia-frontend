import axios from "axios";
const baseURL = import.meta.env.VITE_BACKEND_URL;


export async function getColleges() {
  const res = await axios.get(`${baseURL}/api/colleges`);
  return res.data;
}

export async function getAllDepartments() {
  const res = await axios.get(`${baseURL}/api/departments`);
  return res.data;
}

export async function getCollegeDepartments(id) {
  const res = await axios.get(`${baseURL}/api/colleges/${id}`);
  return res.data;
}

export async function getProfessors({ collegeId, departmentId } = {}) {
  const params = {};
  if (collegeId) params.collegeId = collegeId;
  if (departmentId) params.departmentId = departmentId;

  const res = await axios.get(`${baseURL}/api/professors`, { params });
  return res.data;
}

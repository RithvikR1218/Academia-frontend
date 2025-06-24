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

export async function getProfessors({ collegeId, departmentId, researchInterests, page, per_page } = {}) {
  const params = {};

  if (collegeId) params.collegeId = collegeId;
  if (departmentId) params.departmentId = departmentId;
  if (researchInterests && researchInterests.trim()) params.q = researchInterests.trim();
  if (page) params.page = page;
  if (per_page) params.per_page = per_page;

  const res = await axios.get(`${baseURL}/api/professors`, { params });
  return res.data;
}

export async function getProfessorById(id) {
  const res = await axios.get(`${baseURL}/api/professors/${id}`);
  return res.data;
}

export async function updateProfessor(id, data) {
  const res = await axios.put(`${baseURL}/api/professors/${id}`, data);
  return res.data;
}

export async function deleteProfessor(id) {
  const res = await axios.delete(`${baseURL}/api/professors/${id}`);
  return res.data;
}
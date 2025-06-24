import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL;

export async function getSynonyms() {
  const res = await axios.get(`${baseURL}/api/synonyms`);
  return res.data;
}

export async function createSynonym(payload) {
  const res = await axios.post(`${baseURL}/api/synonyms`, payload);
  return res.data;
}

export async function deleteSynonym(id) {
  const res = await axios.delete(`${baseURL}/api/synonyms/${id}`);
  return res.data;
}

export async function updateSynonym(id, data) {
    const res = await axios.put(`${baseURL}/api/synonyms/${id}`, data);
    return res.data;
  }  
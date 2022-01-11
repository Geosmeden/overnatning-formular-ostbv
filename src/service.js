import axios from "axios";

const url = "https://geocloud.beredskabskort.dk/api/v2/sql/geo";
const url1 = "http://localhost:8080/extensions/beredskab/controller/formular";
const key = "fbb2d411cfbc7b706c02359402afe195";
const extUrl =
  "https://geocloud.beredskabskort.dk/extensions/beredskab/controller/formular";

export const postData = (query) => {
  const payload = { q: query, key: key, srs: "25832" };
  return axios.post(url, payload);
};

export const postFormData = (data) => {
  data["overnat_over_150"] = data["overnat_over_150"].toString();
  return axios.post(extUrl, data);
};

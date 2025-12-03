import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5700",
  timeout: 10000,
});

export default authApi;

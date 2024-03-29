import axios from "axios";
import router from "@/router.js";

const ajax = axios.create({
  withCredentials: true,
});

ajax.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if it isn't 401 then ignore
    if (error.response.status !== 401 && error.response.status !== 403) {
      return new Promise((_resolve, reject) => {
        reject(error);
      });
    }

    // if it is already refreshed but still 401, then ignore and redirect to login page
    if (error.config.url === "/auth/refresh") {
      return new Promise((_resolve, reject) => {
        reject(error);
      });
    }

    return new Promise((resolve, reject) => {
      axios
        .post("/auth/refresh")
        .then(() => {
          // re-request previous request after refreshed
          return axios.request(error.config).catch((err) => {
            if (err.response.status === 403) {
              router.push("/profile");
              reject(err);
            }
          });
        })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          if (err.response.status === 401) router.push("/profile");
          reject(err);
        });
    });
  }
);

export default ajax;

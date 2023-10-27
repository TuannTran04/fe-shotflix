import axios from "axios";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";

const refreshToken = async () => {
  try {
    console.log("call api refresh");
    // truyen len cookies
    const base_url = process.env.NEXT_PUBLIC_URL;
    const res = await axios.get(`${base_url}/api/v1/auth/refresh`, {
      withCredentials: true,
    });
    console.log(res);

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const createAxios = (user, dispatch, stateSuccess) => {
  console.log("user createAxios", user);
  const newInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  useEffect(() => {
    const requestIntercept = newInstance.interceptors.request.use(
      (config) => {
        console.log(">>> requestIntercept: <<<", config);

        // const decodedToken = jwt_decode(user?.accessToken);
        // console.log(">>> decodedToken : <<<", decodedToken);

        if (!config.headers["Authorization"]) {
          console.log("khong co authorize thi gan'");
          config.headers["Authorization"] = `Bearer ${user?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = newInstance.interceptors.response.use(
      (response) => {
        console.log(">>> responseIntercept: <<<", response);
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;
        console.log(error);
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          console.log("refresh tokennnnnnnnnnnnnnnnnnnnnnnn");
          prevRequest.sent = true;
          const newAccessToken = await refreshToken();
          const refreshUser = {
            ...user,
            accessToken: newAccessToken.accessToken,
          };
          console.log(">>> refreshUser new <<<", refreshUser);
          if (dispatch && stateSuccess) {
            console.log("dispatch ok");
            dispatch(stateSuccess(refreshUser));
          }

          prevRequest.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken.accessToken}`;
          return newInstance(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      newInstance.interceptors.request.eject(requestIntercept);
      newInstance.interceptors.response.eject(responseIntercept);
    };
  }, [user, refreshToken]);

  return newInstance;
};

// newInstance.interceptors.request.use(
//   async (config) => {
//     let date = new Date();
//     const decodedToken = jwt_decode(user?.accessToken);
//     //   check accesstoken expires , get new token with refresh token
//     if (decodedToken.exp < date.getTime() / 1000) {
//       const data = await refreshToken();
//       const refreshUser = {
//         ...user,
//         accessToken: data.accessToken,
//       };
//       if (dispatch && stateSuccess) {
//         dispatch(stateSuccess(refreshUser));
//       }
//       config.headers["token"] = "Bearer " + data.accessToken;
//     }
//     //
//     return config;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );
// return newInstance;

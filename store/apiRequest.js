import {
  loginFailed,
  loginStart,
  loginSuccess,
  logOutSuccess,
  logOutFailed,
  logOutStart,
  registerStart,
  registerSuccess,
  registerFailed,
} from "./authSlice";
import { addArrFavorite, addArrWatchLater, deleteSuccess } from "./filmSlice";
import axios from "axios";
import Cookies from "js-cookie";

// import Cookies from 'universal-cookie';
// const cookies = new Cookies();
////////////////////******************** AUTH ********************////////////////////////////
export const login = async (user, dispatch, router, toast) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  dispatch(loginStart());
  try {
    const res = await axios.post(`${base_url}/api/v1/auth/login`, user);
    if (res.data.code == 200) {
      let c = res.data.data.accessToken.toString();
      // Cookies.set("user-server", "abc");
      // Cookies.set("accessToken", c);
      dispatch(loginSuccess(res.data.data));
      toast("Đăng nhập thành công");
      router.push("/");
    }
  } catch (err) {
    console.log(err);
    dispatch(loginFailed());
    if (err?.response?.data?.code) {
      toast(err.response.data.err.mes);
    }
  }
};

export const registerOTP = async (
  dataForm,
  verifyOTP,
  setVerifyOTP,
  dispatch,
  router,
  toast
) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  dispatch(registerStart());

  try {
    let response;
    // console.log(">>> dataForm REGISTER VERIFY <<<", dataForm);

    if (!verifyOTP) {
      response = await axios.post(`${base_url}/api/v1/auth/register`, dataForm);
      console.log(">>> Response REGISTER <<<", response);
      if (response.status === 200) {
        setVerifyOTP(true);
        console.log(response.data);
        toast(response?.data?.message);
      }
    } else {
      response = await axios.post(
        `${base_url}/api/v1/auth/register/verify`,
        dataForm
      );
      console.log(">>> Response REGISTER VERIFY <<<", response);
      console.log(">>> dataForm REGISTER VERIFY <<<", dataForm);
      const { username, password, email } = dataForm;
      dispatch(registerSuccess({ username, password, email }));
      toast(response?.data?.mes);
      router.push("/login");
    }
  } catch (error) {
    console.log(error);
    dispatch(registerFailed());

    if (error?.response?.data.mes.code === 11000) {
      toast(`${Object.keys(error.response.data.mes.keyValue)[0]} đã tồn tại`);
    }

    if (error?.response?.data?.code == 404) {
      toast(error?.response?.data?.mes);
      toast(error?.response?.data?.mes?.mes);
    }
  }
};

export const logOut = async (dispatch, id, router, accessToken, axiosJWT) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  dispatch(logOutStart());
  try {
    await axios.post(`${base_url}/api/v1/auth/logout`, id);
    Cookies.remove("accessToken");
    dispatch(logOutSuccess());
    router.push("/");
  } catch (err) {
    dispatch(logOutFailed());
  }
};

////////////////////******************** USERS ********************////////////////////////////
// export const getAllUsers = async (token, dispatch, axiosJWT) => {
//   // dispatch(getUsersStart());
//   const base_url = process.env.NEXT_PUBLIC_URL;
//   try {
//     const res = await axiosJWT.get(`${base_url}/api/v1/user/`, {
//       headers: { token: `Bearer ${token}` },
//     });
//     // dispatch(getUsersSuccess(res.data));
//     // console.log(res);
//     return res;
//   } catch (err) {
//     // dispatch(getUsersFailed());
//     console.log(err);
//     throw new Error(err);
//   }
// };

export const updateInfoUser = async (
  formData,
  token,
  refreshToken,
  dispatch,
  axiosJWT
) => {
  // dispatch(getUsersStart());
  const base_url = process.env.NEXT_PUBLIC_URL;
  try {
    const res = await axiosJWT.put(
      `${base_url}/api/v1/user/update-info-user`,
      formData,
      {
        headers: { token: `Bearer ${token}` },
      }
    );
    const newData = { ...res.data.data, accessToken: token, refreshToken };
    // console.log(res);
    if (res.status == 200) {
      dispatch(loginSuccess(newData));
    }
    return res;
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};

// export const deleteUser = async (id, dispatch, token) => {
//   dispatch(deleteUsersStart());
//   try {
//     const res = await axios.delete("/v1/user/" + id, {
//       headers: { token: `Bearer ${token}` },
//     });
//     dispatch(deleteUsersSuccess(res.data));
//   } catch (err) {
//     dispatch(deleteUsersFailed(err.response.data));
//   }
// };

////////////////////******************** MOVIES ********************////////////////////////////
export const getAllMovies = async () => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.get(`${base_url}/api/v1/movie`);
    // console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};

export const getFavoriteMovies = async (token, dispatch, axiosJWT) => {
  const base_url = process.env.NEXT_PUBLIC_URL;

  try {
    const res = await axiosJWT.get(
      `${base_url}/api/v1/user/get-favorite-movie`,
      {
        headers: { token: `Bearer ${token}` },
      }
    );
    dispatch(addArrFavorite(res.data.loveMovie));
    // console.log(">>> getFavoriteMovies <<<", res);
    return res;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getWatchLaterMovies = async (token, dispatch, axiosJWT) => {
  // dispatch(getUsersStart());
  const base_url = process.env.NEXT_PUBLIC_URL;

  try {
    const res = await axiosJWT.get(
      `${base_url}/api/v1/user/get-bookmark-movie`,
      {
        headers: { token: `Bearer ${token}` },
      }
    );
    dispatch(addArrWatchLater(res.data.markBookMovie));
    // console.log(">>> getWatchLaterMovies <<<", res);
    return res;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const addFavoriteMovie = async (userId, movieId, isLove) => {
  const data = { userId, movieId, isLove };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.post(
      `${base_url}/api/v1/movie/add-favorite-movie`,
      data
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const deleteFavoriteMovie = async (userId, movieId, isLove) => {
  const data = { userId, movieId, isLove };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.post(
      `${base_url}/api/v1/movie/delete-favorite-movie`,
      data
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};

export const addBookmarkMovie = async (userId, movieId, isBookmark) => {
  const data = { userId, movieId, isBookmark };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.post(
      `${base_url}/api/v1/movie/add-bookmark-movie`,
      data
    );
    console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const deleteBookmarkMovie = async (userId, movieId, isBookmark) => {
  const data = { userId, movieId, isBookmark };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.post(
      `${base_url}/api/v1/movie/delete-bookmark-movie`,
      data
    );
    console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};

////////////////////******************** COMMENT ********************////////////////////////////
export const addComment = async (userId, movieId, text) => {
  const data = { userId, movieId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.post(
      `${base_url}/api/v1/comment/add-comment`,
      data
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const addReplyComment = async (userId, movieId, commentId, text) => {
  const data = { userId, movieId, commentId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.post(
      `${base_url}/api/v1/comment/add-reply-comment`,
      data
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const updateCommentById = async (userId, movieId, commentId, text) => {
  const data = { userId, movieId, commentId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.put(
      `${base_url}/api/v1/comment/update-comment`,
      data
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const updateReplyCommentById = async (
  userId,
  movieId,
  commentId,
  commentParentId,
  text
) => {
  const data = { userId, movieId, commentId, commentParentId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.put(
      `${base_url}/api/v1/comment/update-reply-comment`,
      data
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const deleteCommentById = async (commentId) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.delete(
      `${base_url}/api/v1/comment/delete-comment/${commentId}`
    );
    console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const deleteReplyCommentById = async (commentId, commentParentId) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.delete(
      `${base_url}/api/v1/comment/delete-reply-comment/${commentParentId}/${commentId}`
    );
    console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};

////////////////////******************** NOTIFY ********************////////////////////////////
export const addNotify = async (
  sender,
  recipient,
  movieId,
  commentId,
  text
) => {
  const data = { sender, recipient, movieId, commentId, text };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.post(`${base_url}/api/v1/notify/add-notify`, data);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const updateNotifyRead = async (notifyId) => {
  const data = { notifyId };
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.put(
      `${base_url}/api/v1/notify/update-notify-read`,
      data
    );
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};
export const deleteNotifyById = async (notifyId) => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  // dispatch(getUsersStart());
  try {
    const res = await axios.delete(
      `${base_url}/api/v1/notify/delete-notify/${notifyId}`
    );
    console.log(res);
    return res;
    // dispatch(getUsersSuccess(res.data));
  } catch (err) {
    // dispatch(getUsersFailed());
    console.log(err);
    throw new Error(err);
  }
};

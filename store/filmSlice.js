import { createSlice } from "@reduxjs/toolkit";

const filmSlice = createSlice({
  name: "film",
  initialState: {
    movies: {},
    favoriteFilm: [],
    watchLaterFilm: [],
  },
  reducers: {
    fetchStart: (state) => {
      state.login.isFetching = true;
    },
    addArrFavorite: (state, action) => {
      // console.log(action.payload);
      state.favoriteFilm = action.payload;
    },
    addArrWatchLater: (state, action) => {
      state.watchLaterFilm = action.payload;
    },
    addDataMovies: (state, action) => {
      state.movies = action.payload;
    },

    deleteSuccess: (state) => {
      // state.favoriteFilm = [];
      // state.watchLaterFilm = [];
      state.movies = {};
    },
    deleteSuccess_user: (state) => {
      state.favoriteFilm = [];
      state.watchLaterFilm = [];
    },
  },
});

export const {
  addArrFavorite,
  addArrWatchLater,
  addDataMovies,
  deleteSuccess,
  deleteSuccess_user,
} = filmSlice.actions;

export default filmSlice.reducer;

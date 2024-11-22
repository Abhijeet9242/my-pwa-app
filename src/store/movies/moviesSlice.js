import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import movieApi from "../../common/api/movieApi";
import { APIKEY } from "../../common/api/movieApiKey";

// We are writing asynchronous action creators

export const fetchAsyncMovies = createAsyncThunk("movies/fetchAsyncMovies", async (term) => {
  const response = await movieApi.get(`?apikey=${APIKEY}&s=${term}&type=movie`)
    .catch((error) => {
      console.log("err", error);
    });
  return response.data;
});

export const fetchAsyncShows = createAsyncThunk("movies/fetchAsyncShows", async (term) => {
  const response = await movieApi.get(`?apikey=${APIKEY}&s=${term}&type=series`)
    .catch((error) => {
      console.log("err", error);
    });
  return response.data;
});

// Fetch single item by imdbID
export const fetchAsyncMovieorShowDetail = createAsyncThunk(
  "movies/fetchAsyncMovieorShowDetail",
  async (id) => {
    const response = await movieApi.get(`?apikey=${APIKEY}&i=${id}&Plot=full`);
    return response.data;
  }
);

const initialState = {
  moviesdata: {},
  showsdata: {},
  selectedMovieorShow: {}
};

export const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    addMovies: (state, { payload }) => {
      state.moviesdata = payload;
    },
    removeSelectedMovieorShow: (state) => {
      state.selectedMovieorShow = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncMovies.pending, () => {
        console.log("pending");
      })
      .addCase(fetchAsyncMovies.fulfilled, (state, { payload }) => {
        console.log("Fetched Successfully");
        state.moviesdata = payload;
      })
      .addCase(fetchAsyncMovies.rejected, () => {
        console.log("rejected");
      })

      // Shows
      .addCase(fetchAsyncShows.pending, () => {
        console.log("pending");
      })
      .addCase(fetchAsyncShows.fulfilled, (state, { payload }) => {
        console.log("Fetched Successfully");
        state.showsdata = payload;
      })
      .addCase(fetchAsyncShows.rejected, () => {
        console.log("rejected");
      })

      // Selected movie
      .addCase(fetchAsyncMovieorShowDetail.fulfilled, (state, { payload }) => {
        console.log("Fetched Successfully");
        state.selectedMovieorShow = payload;
      });
  }
});

export const { addMovies, removeSelectedMovieorShow } = movieSlice.actions;

// Creating functions to get state values from store => state.slicename.stateproperty
export const getAllMovies = (state) => state.movies.moviesdata;
export const getAllShows = (state) => state.movies.showsdata;
export const getSelectedMovieorShow = (state) => state.movies.selectedMovieorShow;

export default movieSlice.reducer;

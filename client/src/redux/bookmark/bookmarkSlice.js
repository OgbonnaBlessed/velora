import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';  // Importing createSlice and createAsyncThunk from Redux Toolkit

// Thunk to fetch the bookmarks from the API
export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',  // The action type for this async thunk
  async (userId, { rejectWithValue }) => {  // The async function that fetches bookmarks, receiving userId as an argument
    try {
      const response = await fetch(`/api/user/${userId}/bookmarks`);  // Fetch bookmarks from the API
      const data = await response.json();  // Parse the response as JSON

      if (!response.ok) {  // If the response is not OK, reject the value
        return rejectWithValue('Failed to fetch bookmarks');  // Return an error message
      }

      return data.bookmarks;  // Return the bookmarks array from the response data
    } catch (error) {
      return rejectWithValue(error.message);  // If there's an error, reject with the error message
    }
  }
);

// Thunk to delete a bookmark from the API
export const deleteBookmark = createAsyncThunk(
  'bookmarks/deleteBookmark',  // The action type for deleting a bookmark
  async ({ userId, postId }, { rejectWithValue, dispatch }) => {  // Receive userId and postId to delete the bookmark
    try {
      const response = await fetch(`/api/user/${userId}/bookmark/${postId}`, {
        method: 'DELETE',  // Make a DELETE request to remove the bookmark
      });

      if (!response.ok) {  // If the response is not OK, reject the value
        return rejectWithValue('Failed to delete bookmark');  // Return an error message
      }

      // After successfully deleting the bookmark, re-fetch the updated list of bookmarks
      dispatch(fetchBookmarks(userId));
      return postId;  // Return the deleted bookmark's postId to update the state
    } catch (error) {
      return rejectWithValue(error.message);  // If there's an error, reject with the error message
    }
  }
);

// Slice for managing the bookmarks state
const bookmarkSlice = createSlice({
  name: 'bookmarks',  // Name of the slice, used to identify this part of the state
  initialState: {  // Initial state for this slice
    items: [],  // Array of bookmarks
    totalBookmarks: 0,  // Total count of bookmarks
    status: 'idle',  // Status of the async operation (idle, loading, succeeded, failed)
    error: null,  // Error message if the fetch or delete operation fails
  },
  reducers: {},  // No local reducers needed for this slice as we're using async thunks

  // Handling the different async thunk states (pending, fulfilled, rejected)
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {  // When the fetchBookmarks thunk is pending (loading)
        state.status = 'loading';  // Set the status to loading
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {  // When the fetchBookmarks thunk is fulfilled (succeeded)
        state.status = 'succeeded';  // Set the status to succeeded
        state.items = action.payload;  // Set the bookmarks array with the fetched data
        state.totalBookmarks = action.payload.length;  // Set the total number of bookmarks
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {  // When the fetchBookmarks thunk is rejected (failed)
        state.status = 'failed';  // Set the status to failed
        state.error = action.payload;  // Store the error message
      })
      .addCase(deleteBookmark.fulfilled, (state, action) => {  // When the deleteBookmark thunk is fulfilled (succeeded)
        // Remove the deleted bookmark from the items array
        state.items = state.items.filter((bookmark) => bookmark._id !== action.payload);
        state.totalBookmarks = state.items.length;  // Update the total bookmarks count
      });
  },
});

// Export the reducer function from the slice to be used in the store
export default bookmarkSlice.reducer;
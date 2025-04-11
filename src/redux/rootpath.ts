import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type RootPathState = {
  value: string; 
};

const initialState:RootPathState = { value: '' };

export const RootPathSlice = createSlice({
  name: 'rootpath',
  initialState,
  reducers: {
    setRootPath: (state, action: PayloadAction<RootPathState>) => {
      state.value = action.payload.value
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRootPath } = RootPathSlice.actions

export default RootPathSlice.reducer

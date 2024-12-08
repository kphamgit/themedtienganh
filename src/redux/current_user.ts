import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type UserState = {value: 
  {
    id?: number
    user_name?: string
    full_name?: string,
    role?: string
    level?: string
    classId?: number
    message?: string
  }
};

const initialState:UserState = { value: {} }

export const UserSlice = createSlice({
  name: 'currentuser',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserState>) => {
      state.value = action.payload.value
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentUser } = UserSlice.actions

export default UserSlice.reducer
/*

*/
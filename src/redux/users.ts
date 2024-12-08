//import { faL } from '@fortawesome/free-solid-svg-icons'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface User {
  id: number;
  name: string;
}

interface UserState {
  users: User[];
}

const initialState:UserState = {
  users: []
}

export const UserSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<{name: string}>) => {
      state.users.push({
        id: state.users.length,
        name: action.payload.name
      });
    },
  },
});
/*
{
        id: state.users.length,
        name: action.payload.name
      }
*/

// Action creators are generated for each case reducer function
export const { addUser } = UserSlice.actions

export default UserSlice.reducer
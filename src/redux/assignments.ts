import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AssignmentProps = {
  assignment_number: number;
  message: string;
  quiz_link: string;
  quiz_name: string;
  // Add other relevant fields
};

type AssignmentsState = {
  value: AssignmentProps[];
};

const initialState: AssignmentsState = {
  value: [],
};

export const AssignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setAssignments: (state, action: PayloadAction<AssignmentProps[]>) => {
      console.log("AssignmentSlice setAssignments, action.payload=", action.payload)
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAssignments } = AssignmentSlice.actions;
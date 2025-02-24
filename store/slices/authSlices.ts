import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    phoneNumber: string | null;
    hasMpin: boolean;
    hasCompletedProfile: boolean;
    name: string | null;
    email: string | null;
    major: string | null;
    graduationYear: string | null;
    collegeName: string | null;
    degree: string | null;
    dob: string | Date | null;
    city: string | null;
    gender: string | null;
  };
  userData: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: {
    phoneNumber: null,
    hasMpin: false,
    hasCompletedProfile: false,
    name: null,
    email: null,
    dob: null,
    city: null,
    major: null,
    graduationYear: null,
    collegeName: null,
    degree: null,
    gender: null,
  },
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUserData: (state, action: PayloadAction<string | null>) => {
      state.userData = action.payload;
    },

    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.user.phoneNumber = action.payload;
    },
    setHasMpin: (state, action: PayloadAction<boolean>) => {
      state.user.hasMpin = action.payload;
    },
    setHasCompletedProfile: (state, action: PayloadAction<boolean>) => {
      state.user.hasCompletedProfile = action.payload;
    },
    updateUserProfile: (
      state,
      action: PayloadAction<Partial<AuthState["user"]>>
    ) => {
      state.user = { ...state.user, ...action.payload };
    },
    resetAuth: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setAuthenticated,
  setToken,
  setPhoneNumber,
  setHasMpin,
  setHasCompletedProfile,
  updateUserProfile,
  resetAuth,
  setUserData,
} = authSlice.actions;

export default authSlice.reducer;

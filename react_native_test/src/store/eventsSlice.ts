import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: any[] = [];

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<any[]>) => action.payload,
    addEvent: (state, action: PayloadAction<any>) => { state.push(action.payload); },
  },
});

export const { setEvents, addEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
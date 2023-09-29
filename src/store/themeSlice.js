import {createSlice} from '@reduxjs/toolkit';


const themeSlice = createSlice({
    name: 'themeSwitch',
    initialState: {
        themeMode: 'lightMode'
    },
    reducers: {
        switchTheme(state) {
            if (state.themeMode === 'lightMode') {
                state.themeMode = 'darkMode';
            } else {
                state.themeMode = 'lightMode';
            }
        }
    }
});

export const {switchTheme} = themeSlice.actions; 
export default themeSlice.reducer;

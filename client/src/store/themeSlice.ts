import {createSlice} from '@reduxjs/toolkit';


interface ITheme {
    themeMode: string;
}

const initialTheme: ITheme = {
    themeMode: 'lightMode'
}

const themeSlice = createSlice({
    name: 'themeSwitch',
    initialState: initialTheme,
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

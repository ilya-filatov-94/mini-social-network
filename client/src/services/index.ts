import { 
    fetchBaseQuery, 
    BaseQueryFn, 
    FetchArgs, 
    FetchBaseQueryError 
} from "@reduxjs/toolkit/query/react";
import {API_URL} from '../env_variables'; 
import {RootState} from '../store';
import {logoutUser, updateToken} from '../store/authSlice';
import {IReAuthResponse} from '../types/authReducer';


const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, {getState}) => {
        const state = getState() as RootState;
        const token = state.reducerAuth.accessToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
    credentials: "include",
});

let isRetryRequest = false;

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401 && !isRetryRequest) {    
        isRetryRequest = true;   
        const refreshResult = await baseQuery({
            url: '/user/refresh/',
            method: 'GET'
        }, api, extraOptions);

        if (refreshResult.data) {
            const tokens = refreshResult.data as IReAuthResponse;
            api.dispatch(updateToken(tokens.accessToken as string));
            // повторяем запрос
            result = await baseQuery(args, api, extraOptions);
            isRetryRequest = false;
        } else {
            const state = api.getState() as RootState;
            const userId = state.reducerAuth.currentUser.id;
            api.dispatch(logoutUser(userId));
            isRetryRequest = false;
        }
    }
    return result;
};
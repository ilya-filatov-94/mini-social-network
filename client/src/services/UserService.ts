import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';
import {IUserData} from '../types/authReducer';


export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUserData: builder.query<IUserData, string>({
          query: (refUser) => ({
            url: `/user/profile/${refUser}`
          }),
          extraOptions: { maxRetries: 3 },
          keepUnusedDataFor: 60,
        })
    })
});

export const {useGetUserDataQuery} = userApi;
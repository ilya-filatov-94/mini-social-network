import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';
import {IUserData} from '../types/authReducer';
import {IUserFullData} from '../types/users';


export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ProfileData'],
    endpoints: (builder) => ({
        getUserProfile: builder.query<IUserData, string>({
          query: (refUser) => ({
            url: `/user/profile/${refUser}`
          }),
          extraOptions: { maxRetries: 3 },
          keepUnusedDataFor: 60,
          providesTags: ['ProfileData']
        }),
        getUserData: builder.query<IUserFullData, string>({
          query: (refUser) => ({
            url: `/user/profile/${refUser}/edit`
          }),
          extraOptions: { maxRetries: 3 },
          keepUnusedDataFor: 60,
          providesTags: ['ProfileData']
        }),
    })
});

export const {
  useGetUserProfileQuery,
  useGetUserDataQuery
} = userApi;
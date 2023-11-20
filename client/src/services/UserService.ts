import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';
import {IUserData} from '../types/authReducer';
import {IUserFullData, IFollower, IListUsers} from '../types/users';


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
        updateUser: builder.mutation<IUserFullData, FormData>({
          query: (data) => ({
            url: `/user/profile/update`,
            method: 'PATCH',
            body: data
          }),
          extraOptions: { maxRetries: 3 },
          invalidatesTags: (result, error) => error ? [] : ['ProfileData']
        }),
        getFollowers: builder.query<IFollower[], number>({
          query: (id) => ({
            url: `/user/followers?id=${id}`,
          }),
          extraOptions: { maxRetries: 3 },
          keepUnusedDataFor: 60,
        }),
        getAllUsers: builder.query<IListUsers[], number>({
          query: (id) => ({
            url: `/user/all?cur_user=${id}`,
          }),
          extraOptions: { maxRetries: 3 },
          keepUnusedDataFor: 60,
        }),
    })
});

export const {
  useGetUserProfileQuery,
  useGetUserDataQuery,
  useUpdateUserMutation,
  useGetFollowersQuery,
  useGetAllUsersQuery
} = userApi;
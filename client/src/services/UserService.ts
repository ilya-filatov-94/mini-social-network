import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';
import {IUserData, IRequestProfile} from '../types/authReducer';
import {
  IUserFullData, 
  IFollower, 
  IListUsers, 
  IActionSubscribeTo,
  IPossibleFriend,
  IRequestMutualFriend
} from '../types/users';


export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ProfileData', 'PossibleFriend'],
    endpoints: (builder) => ({
        getUserProfile: builder.query<IUserData, IRequestProfile>({
          query: (data) => ({
            url: `/user/profile/${data.ref}?id=${data.id}`
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
        updateUserData: builder.mutation<IUserFullData, FormData>({
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
        subscribeToUser: builder.mutation<IActionSubscribeTo, IActionSubscribeTo>({
          query: (data) => ({
            url: '/user/follow',
            method: 'POST',
            body: data
          }),
          extraOptions: { maxRetries: 5 },
          invalidatesTags: ['PossibleFriend']
        }),
        unSubscribeToUser: builder.mutation<number, IActionSubscribeTo>({
          query: (data) => ({
            url: '/user/unfollow',
            method: 'POST',
            body: data
          }),
          extraOptions: { maxRetries: 5 },
        }),
        getPossibleFriends: builder.query<IPossibleFriend[], number>({
          query: (id) => ({
            url: `/user/suggestions?id=${id}`,
          }),
          extraOptions: { maxRetries: 5 },
          keepUnusedDataFor: 60,
          providesTags: ['PossibleFriend']
        }),
        getMutualFriends: builder.query<IPossibleFriend[], IRequestMutualFriend>({
          query: (data) => ({
            url: `/user/common?id=${data.id}&pos_id=${data.pos_id}`,
          }),
          extraOptions: { maxRetries: 5 },
          keepUnusedDataFor: 60,
        }),
    })
});

export const {
  useGetUserProfileQuery,
  useGetUserDataQuery,
  useUpdateUserDataMutation,
  useGetFollowersQuery,
  useGetAllUsersQuery,
  useSubscribeToUserMutation,
  useUnSubscribeToUserMutation,
  useGetPossibleFriendsQuery,
  useGetMutualFriendsQuery
} = userApi;

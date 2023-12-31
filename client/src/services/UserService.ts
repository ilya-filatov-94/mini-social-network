import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';
import {IUserData, IRequestProfile} from '../types/authReducer';
import {
  IUserFullData, 
  IFollower, 
  IActionSubscribeTo,
  IPossibleFriend,
  IListUsers,
  IRequestMutualFriend,
  IFollowerRequest,
  IFollowerResponse,
  IAllUsersRequest,
  IAllUsersResponse
} from '../types/users';
import {IActivityOfUser} from '../types/activities';


export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ProfileData', 'PossibleFriend'],
    endpoints: (builder) => ({
        getUserProfile: builder.query<IUserData, IRequestProfile>({
          query: (data) => ({
            url: `/user/profile/${data.ref}`,
            params: {
              id: data.id
            }
          }),
          keepUnusedDataFor: 60,
          providesTags: ['ProfileData']
        }),
        getUserData: builder.query<IUserFullData, string>({
          query: (refUser) => ({
            url: `/user/profile/${refUser}/edit`
          }),
          keepUnusedDataFor: 60,
          providesTags: ['ProfileData']
        }),
        updateUserData: builder.mutation<IUserFullData, FormData>({
          query: (data) => ({
            url: `/user/profile/update`,
            method: 'PATCH',
            body: data
          }),
          invalidatesTags: (result, error) => error ? [] : ['ProfileData']
        }),
        getFollowers: builder.query<IFollower[], number>({
          query: (id) => ({
            url: `/user/followers`,
            params: {
              id: id
            }
          }),
          keepUnusedDataFor: 60,
        }),
        getFollowersPagination: builder.query<IFollowerResponse, IFollowerRequest>({
          query: (data) => ({
            url: `/user/followers-pag`,
            params: {
              id: data.id,
              page: data.page,
              limit: data.limit,
              selector: data.selector
            }
          }),
          keepUnusedDataFor: 60,
        }),
        getAllUsers: builder.query<IListUsers[], number>({
          query: (id) => ({
            url: `/user/all`,
            params: {
              cur_user: id
            }
          }),
          keepUnusedDataFor: 60,
        }),
        getSearchAllUsers: builder.query<IAllUsersResponse, IAllUsersRequest>({
          query: (data) => ({
            url: `/user/all-selected`,
            params: {
              id: data.id,
              search: data.search,
              page: data.page,
              limit: data.limit,
            }
          }),
          keepUnusedDataFor: 60,
        }),
        subscribeToUser: builder.mutation<IActionSubscribeTo, IActionSubscribeTo>({
          query: (data) => ({
            url: '/user/follow',
            method: 'POST',
            body: data
          }),
          invalidatesTags: ['PossibleFriend']
        }),
        unSubscribeToUser: builder.mutation<number, IActionSubscribeTo>({
          query: (data) => ({
            url: '/user/unfollow',
            method: 'POST',
            body: data
          }),
        }),
        getPossibleFriends: builder.query<IPossibleFriend[], number>({
          query: (id) => ({
            url: `/user/suggestions`,
            params: {
              id: id
            }
          }),
          keepUnusedDataFor: 60,
          providesTags: ['PossibleFriend']
        }),
        getMutualFriends: builder.query<IPossibleFriend[], IRequestMutualFriend>({
          query: (data) => ({
            url: `/user/common`,
            params: {
              id: data.id,
              pos_id: data.pos_id
            }
          }),
          keepUnusedDataFor: 60,
        }),
        getActivitiesUsers: builder.query<IActivityOfUser[], number>({
          query: (id) => ({
            url: 'user/activities',
            params: {
              id: id,
            }
          }),
          keepUnusedDataFor: 60,
        }),
    })
});

export const {
  useGetUserProfileQuery,
  useGetUserDataQuery,
  useUpdateUserDataMutation,
  useGetFollowersQuery,
  useGetFollowersPaginationQuery,
  useGetAllUsersQuery,
  useGetSearchAllUsersQuery,
  useSubscribeToUserMutation,
  useUnSubscribeToUserMutation,
  useGetPossibleFriendsQuery,
  useGetMutualFriendsQuery,
  useGetActivitiesUsersQuery
} = userApi;

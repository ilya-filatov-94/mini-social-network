import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';
import {IPostData, ILikes /*ICheckData*/} from '../types/posts';


export const postApi = createApi({
    reducerPath: 'postApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Posts'],
    endpoints: (builder) => ({
        getAllPosts: builder.query<IPostData[], number>({
          query: (userId) => ({
            url: `/post/all`,
            params: {
              id: userId
            }
          }),
          providesTags: (result) => result
          ? [...result.map(({ id }) => ({ type: 'Posts' as const, id })), 'Posts']
          : ['Posts'],
          keepUnusedDataFor: 60,
        }),
        getOnePost: builder.query<IPostData, number>({
          query: (postId) => ({
            url: `/post/one`,
            params: {
              postId: postId
            }
          }),
          keepUnusedDataFor: 60,
        }),
        addPost: builder.mutation<IPostData, FormData>({
          query: (data) => ({
            url: `/post/create`,
            method: 'POST',
            body: data
          }),
          invalidatesTags: ['Posts'],
        }),
        updatePost: builder.mutation<IPostData, FormData>({
          query: (data) => ({
            url: `/post/update`,
            method: 'PATCH',
            body: data
          }),
          invalidatesTags: ['Posts'],
        }),
        deletePost: builder.mutation<number, number>({
          query: (data) => ({
            url: `/post/delete`,
            method: 'DELETE',
            body: {id: data}
          }),
          invalidatesTags: ['Posts'],
        }),
        getLikes: builder.query<ILikes[], number>({
          query: (postId) => ({
            url: `/post/likes`,
            params: {
              postId: postId
            }
          }),
          keepUnusedDataFor: 60,
        }),
        addLike: builder.mutation<ILikes, ILikes>({
          query: (data) => ({
            url: `/post/add-like`,
            method: 'PATCH',
            body: data
          }),
        }),
        removeLike: builder.mutation<ILikes, ILikes>({
          query: (data) => ({
            url: `/post/remove-like`,
            method: 'DELETE',
            body: data
          }),
        }),
    })
});

export const {
  useGetAllPostsQuery,
  useGetOnePostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetLikesQuery,
  useAddLikeMutation,
  useRemoveLikeMutation
} = postApi;





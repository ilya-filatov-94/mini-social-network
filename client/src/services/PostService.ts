import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';
import {IPostData, ICheckData} from '../types/posts';



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
          extraOptions: { maxRetries: 3 },
          keepUnusedDataFor: 60,
        }),
        addPost: builder.mutation<IPostData, FormData>({
          query: (data) => ({
            url: `/post/create`,
            method: 'POST',
            body: data
          }),
          invalidatesTags: ['Posts'],
          extraOptions: { maxRetries: 3 },
        }),
        checkApi: builder.query<ICheckData, void>({
          query: () => `/post/auth`,
          extraOptions: { maxRetries: 3 },
          keepUnusedDataFor: 60,
        }),
    })
});

export const {useGetAllPostsQuery, useAddPostMutation} = postApi;





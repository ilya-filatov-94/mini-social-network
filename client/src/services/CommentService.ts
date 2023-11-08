import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';
import {IComments, ICommentReq} from '../types/comments';



export const commentApi = createApi({
    reducerPath: 'commentApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Comments'],
    endpoints: (builder) => ({
        getAllComments: builder.query<IComments[], ICommentReq>({
          query: (data) => ({
            url: `/comment/all`,
            params: {
              userId: data.userId,
              postId: data.postId
            }
          }),
          providesTags: (result) => result
          ? [...result.map(({ id }) => ({ type: 'Comments' as const, id })), 'Comments']
          : ['Comments'],
          extraOptions: { maxRetries: 3 },
          keepUnusedDataFor: 60,
        }),
        addComment: builder.mutation<IComments, FormData>({
          query: (data) => ({
            url: `/comment/create`,
            method: 'POST',
            body: data
          }),
          invalidatesTags: ['Comments'],
          extraOptions: { maxRetries: 3 },
        }),
        deleteComment: builder.mutation<number, ICommentReq>({
          query: (data) => ({
            url: `/comment/delete`,
            method: 'DELETE',
            body: {
                userId: data.userId,
                postId: data.postId
            }
          }),
          invalidatesTags: ['Comments'],
          extraOptions: { maxRetries: 3 },
        }),
    })
});

export const {
    useGetAllCommentsQuery,
    useAddCommentMutation,
    useDeleteCommentMutation
} = commentApi;





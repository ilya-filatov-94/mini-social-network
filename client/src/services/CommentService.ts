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
              id_post: data.postId
            }
          }),
          providesTags: (result) => result
          ? [...result.map(({ id }) => ({ type: 'Comments' as const, id })), 'Comments']
          : ['Comments'],
          keepUnusedDataFor: 60,
        }),
        addComment: builder.mutation<IComments, ICommentReq>({
          query: (data) => ({
            url: `/comment/create`,
            method: 'POST',
            body: data
          }),
          invalidatesTags: ['Comments'],
        }),
        deleteComment: builder.mutation<number, ICommentReq>({
          query: (data) => ({
            url: `/comment/delete`,
            method: 'DELETE',
            body: {
              postId: data.postId,
              comId: data.id
            }
          }),
          invalidatesTags: ['Comments'],
        }),
    })
});

export const {
    useGetAllCommentsQuery,
    useAddCommentMutation,
    useDeleteCommentMutation
} = commentApi;





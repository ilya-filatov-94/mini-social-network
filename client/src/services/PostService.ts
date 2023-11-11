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
        updatePost: builder.mutation<IPostData, FormData>({
          query: (data) => ({
            url: `/post/update`,
            method: 'PATCH',
            body: data
          }),
          invalidatesTags: ['Posts'],
          extraOptions: { maxRetries: 3 },
        }),
        deletePost: builder.mutation<number, number>({
          query: (data) => ({
            url: `/post/delete`,
            method: 'DELETE',
            body: {id: data}
          }),
          invalidatesTags: ['Posts'],
          extraOptions: { maxRetries: 3 },
        }),
        getLikes: builder.query<ILikes[], ILikes>({
          query: (data) => ({
            url: `/post/getlikes`,
            params: {
              user_id: data.userId, 
              post_id: data.postId
            }
          }),
          extraOptions: { maxRetries: 3 },
        }),
        addLike: builder.mutation<ILikes, ILikes>({
          query: (data) => ({
            url: `/post/addlike`,
            method: 'PATCH',
            body: data
          }),
          extraOptions: { maxRetries: 3 },
        }),
        removeLike: builder.mutation<ILikes, ILikes>({
          query: (data) => ({
            url: `/post/removelike`,
            method: 'DELETE',
            body: data
          }),
          extraOptions: { maxRetries: 3 },
        }),
        // checkApi: builder.query<ICheckData, void>({
        //   query: () => `/post/auth`,
        //   extraOptions: { maxRetries: 3 },
        //   keepUnusedDataFor: 60,
        // }),
//         router.patch('/addlike', authMiddleware, postController.addLike);
// router.delete('/removelike', authMiddleware, postController.removeLike); 
    })
});

export const {
  useGetAllPostsQuery, 
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation
} = postApi;





import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';

import {IPostData} from '../types/posts';



export const postApi = createApi({
    reducerPath: 'postApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        checkApi: builder.query({
          query: () => `/post/auth`,
          extraOptions: { maxRetries: 3 },
          keepUnusedDataFor: 60,
        }),
        getAllPosts: builder.query<IPostData[], void>({
          query: () => `/post/all`,
          extraOptions: { maxRetries: 3 },
          keepUnusedDataFor: 60,
        })
    })
});

export const {useGetAllPostsQuery} = postApi;





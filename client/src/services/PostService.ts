import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';

import {IPostData} from '../types/posts';



export const postApi = createApi({
    reducerPath: 'baseApi',
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


// export const postApi = createApi({
//     reducerPath: 'postApi',
//     baseQuery: fetchBaseQuery({
//         baseUrl: API_URL,
//         prepareHeaders: (headers, {getState}) => {
//             const state = getState() as RootState;
// 		    const token = state.reducerAuth.accessToken;
//             if (token) {
//                 headers.set('authorization', `Bearer ${token}`);
//             }
//             return headers;
//         },
//         credentials: "include"
//     }),
//     endpoints: (builder) => ({
//         getAllPosts: builder.query<IPostData[], void>({
//           query: () => `/post/all`,
//           extraOptions: { maxRetries: 3 },
//           keepUnusedDataFor: 60,
//     }),
// })});

// export const {useGetAllPostsQuery} = postApi;




import { 
    createApi, 
} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';
import {IStory, IStoryCreate} from '../types/story';


export const storyApi = createApi({
    reducerPath: 'storyApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Stories'],
    endpoints: (builder) => ({
        getAllStories: builder.query<IStory[], number>({
          query: (userId) => ({
            url: `/story/all`,
            params: {
              id: userId
            }
          }),
          providesTags: (result) => result
          ? [...result.map(({ id }) => ({ type: 'Stories' as const, id })), 'Stories']
          : ['Stories'],
          keepUnusedDataFor: 60,
        }),
        addStory: builder.mutation<IStoryCreate, FormData>({
          query: (data) => ({
            url: `/story/create`,
            method: 'POST',
            body: data
          }),
          invalidatesTags: ['Stories'],
        }),
    })
});

export const {
  useGetAllStoriesQuery,
  useAddStoryMutation
} = storyApi;





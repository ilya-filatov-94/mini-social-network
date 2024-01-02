import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from './index';
import {
  IConversation, 
  IPossibleConversation, 
  IMessage
} from '../types/messenger';


export const messengerApi = createApi({
    reducerPath: 'messengerApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Messenger', 'Messages'],
    endpoints: (builder) => ({
        getConversations: builder.query<IConversation[], number>({
          query: (userId) => ({
            url: `/messenger/conversations`,
            params: {
              id: userId
            }
          }),
          keepUnusedDataFor: 60,
        }),
        searchSelectedMembers: builder.query<IPossibleConversation[], {id: number, selector: string}>({
          query: (data) => ({
            url: `/messenger/members`,
            params: {
                id: data.id,
                selector: data.selector
            }
          }),
          keepUnusedDataFor: 60,
        }),
        openConversation: builder.mutation<IConversation, {userId: number, memberId: number}>({
          query: (data) => ({
            url: `/messenger/conversation`,
            method: 'POST',
            body: {
              curUserId: data.userId,
              memberId: data.memberId
            }
          }),
          invalidatesTags: ['Messenger'],
        }),
        getMessages: builder.query<IMessage[], number>({
          query: (conversationId) => ({
            url: `/messenger/messages`,
            params: {
              conversationId: conversationId
            }
          }),
          providesTags: ['Messages'],
          keepUnusedDataFor: 60,
        }),
        sendMesage: builder.mutation<IMessage[], number>({
          query: (conversationId) => ({
            url: `/messenger/send-message`,
            method: 'POST',
            body: {
              conversationId: conversationId
            }
          }),
          invalidatesTags: ['Messages'],
        }),
    })
});

export const {
  useGetConversationsQuery,
  useSearchSelectedMembersQuery,
  useOpenConversationMutation,
  useGetMessagesQuery,
  useSendMesageMutation,
} = messengerApi;

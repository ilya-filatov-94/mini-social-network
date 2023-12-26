
//Отправляешь curUserId для поиска списка диалогов, 
//получаешь массив объектов IConversation

export interface IConversation {
    id: number;
    memberId: number;
    lastMessageId?: number;
    lastMessageText?: string;
    username: string;
    profilePic: string | undefined;
    refUser: string;
    status?: string;
    addClass?: string;
}

//Ищешь потенциальных собеседников по curUserId и поисковой строке selector, 
//получаешь в ответ массив IPossibleConversation

export interface IPossibleConversation {
    id?: number;
    userId: number;
    username: string;
    profilePic: string | undefined;
    refUser: string;
    status?: string;
    addClass?: string;
}

//По id диалога запрос выполняю, получаю в ответ массив

export interface IMessage {
    id?: number;
    conversationId: number;
    userId: number;
    username?: string;
    text?: string;
    file?: string;
    isRead: boolean;
    createdAt?: string;
}



// export interface IConversation {
//     id: number;
//     username: string;
//     profilePic: string | undefined;
//     refUser: string;

//     memberId: number;
//     // refDialog?: string;
//     // lastMessage?: string;

//     lastMessageId?: number;
//     lastMessageText?: string;

//     /*---------------------------*/
//     status?: string;
//     addClass?: string;
// }



// export interface IMessage {
//     id?: number;
//     conversationId: number;
//     userId: number;
//     socketId?: string;
//     text?: string;
//     file?: string;
//     isRead: boolean;
//     date?: string;
// }


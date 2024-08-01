const sequelize = require('../db');
const {DataTypes} = require('sequelize');


const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    refUser: {type: DataTypes.STRING},
    profilePic: {type: DataTypes.STRING},
    coverPic: {type: DataTypes.STRING},
    city: {type: DataTypes.STRING, defaultValue: "Не указан"},
    website: {type: DataTypes.STRING, defaultValue: "Отсутствует"},
    status: {type: DataTypes.STRING, defaultValue: "offline"},
});

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING},
});

const Post = sequelize.define('post', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    desc: {type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.STRING},
    counterComments: {type: DataTypes.STRING, defaultValue: "0"},
});

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    desc: {type: DataTypes.STRING, allowNull: false},
});

const Story = sequelize.define('story', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    image: {type: DataTypes.STRING, allowNull: false},
});

const Like = sequelize.define('like', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const Activity = sequelize.define('activity', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    idAct: {type: DataTypes.INTEGER},
    type: {type: DataTypes.STRING, allowNull: false},
    desc: {type: DataTypes.STRING},
    text: {type: DataTypes.STRING},
    image: {type: DataTypes.STRING},
});

const Relationship = sequelize.define('relationship', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.STRING},
    followerId: {type: DataTypes.STRING},
});

//Промежуточная таблица для связи многие ко многим
const UserRelationship = sequelize.define('user_relationship', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

//Отношение 1 к 1, доп ключ userId автоматически сгененируется в таблице Token
User.hasOne(Token);
Token.belongsTo(User);

//1 ко многим. Явное указание внешнего ключа userId со ссылкой на пользователя, ключ создаётся в модели Post
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(User);

Post.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Post);

User.hasMany(Story, { onDelete: 'CASCADE' });
Story.belongsTo(User);

User.hasMany(Like, { onDelete: 'CASCADE' });
Like.belongsTo(User);

Post.hasMany(Like, { onDelete: 'CASCADE' });
Like.belongsTo(Post);

User.hasMany(Activity, { onDelete: 'CASCADE' });
Activity.belongsTo(User);

//Связь многие ко многим
Relationship.belongsToMany(User, {through: UserRelationship, as: "users"});
User.belongsToMany(Relationship, {through: UserRelationship, as: "relationship"});

//Схемы для чата
const Conversation = sequelize.define('conversation', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    participantId1: {type: DataTypes.INTEGER},
    participantId2: {type: DataTypes.INTEGER},
    lastMessageId: {type: DataTypes.INTEGER},
    lastMessageText: {type: DataTypes.STRING},
    counterUnreadMessages: {type: DataTypes.INTEGER},
});

const Message = sequelize.define('message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING},
    text: {type: DataTypes.STRING},
    file: {type: DataTypes.STRING},
    isRead: {type: DataTypes.BOOLEAN},
    isDelivery: {type: DataTypes.BOOLEAN},
});

const Notification = sequelize.define('notification', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER},
    senderId: {type: DataTypes.INTEGER},
    ref: {type: DataTypes.STRING},
    type: {type: DataTypes.STRING},
    isRead: {type: DataTypes.BOOLEAN},
});

User.hasMany(Message);
Message.belongsTo(User);

Conversation.hasMany(Message);
Message.belongsTo(Conversation);

User.hasMany(Notification, { foreignKey: 'senderId' });
Notification.belongsTo(User, { foreignKey: 'senderId' });

module.exports = {
    User,
    Token,
    Post,
    Comment,
    Story,
    Like,
    Activity,
    Relationship,
    Conversation,
    Message,
    Notification,
};

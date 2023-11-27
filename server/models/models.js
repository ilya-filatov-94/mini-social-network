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
    counterLikes: {type: DataTypes.STRING, defaultValue: "0"},
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
    desc: {type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.STRING},
    type: {type: DataTypes.STRING},
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

//1 ко многим. Авто ключ со ссылкой на пользователя создаётся в модели Post
User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

Post.hasMany(Comment);
Comment.belongsTo(Post);

User.hasMany(Story);
Story.belongsTo(User);

User.hasMany(Like);
Like.belongsTo(User);

Post.hasMany(Like);
Like.belongsTo(Post);

User.hasMany(Activity);
Activity.belongsTo(User);

//Связь многие ко многим
Relationship.belongsToMany(User, {through: UserRelationship, as: "users"});
User.belongsToMany(Relationship, {through: UserRelationship, as: "relationship"});


module.exports = {
    User,
    Token,
    Post,
    Comment,
    Story,
    Like,
    Activity,
    Relationship,
};

const {Post, User} = require('../models/models');




class PostService {
    async createNewPost(userId, desc, fileName) {
        const post = await Post.create({
            userId: userId,
            desc: desc,
            image: fileName
        });
        return post;
    }

    async getAll(userId) {
        let posts;
        let oneUser = false;
        let users;
        if (userId) {
            oneUser = true;
            posts = await Post.findAll({
                where: {userId: userId},
                attributes: ['id', 'desc', 'image', 'counterLikes', 'counterComments', 'createdAt']
            });
            users = await User.findOne(
                {
                    where: {id: userId},
                    attributes: ['id', 'username', 'refUser', 'profilePic']
                },
            )
        } else {
            posts = await Post.findAll({attributes: ['id', 'desc', 'image', 'counterLikes', 'counterComments', 'createdAt']});
            users = await User.findAll({attributes: ['id', 'username', 'refUser', 'profilePic']});
        }

        if (oneUser) {
            for (let item of posts) {
                let post = item.dataValues;
                let date = new Date(Date.parse(post.createdAt));
                post.date = formatRelativeDate(date);
                post.username = users.dataValues.username;
                post.refUser = users.dataValues.refUser;
                post.profilePic = users.dataValues.profilePic;
            }
        } else {
            for (let item of posts) {
                let post = item.dataValues;
                let date = new Date(Date.parse(post.createdAt));
                post.date = formatRelativeDate(date);
                post.username = users.dataValues.username;
                post.refUser = users.dataValues.refUser;
                post.profilePic = users.dataValues.profilePic;
            }
        }
        return posts.reverse();
    }
}

function formatRelativeDate(datePost) {
  let diff = new Date() - datePost;

  if (diff < 1000) {
    return "прямо сейчас";
  }

  let sec = Math.floor(diff / 1000);
  if (sec < 60) {
    return sec + " сек. назад";
  }

  let min = Math.floor(diff / 60000);
  if (min < 60) {
    return min + " мин. назад";
  }

  let hours = Math.floor(diff / (3600*1000));
  if (hours < 24) {
    if (hours === 1) return hours + " час назад";
    if (hours <= 4 && hours >= 2) return hours + " часа назад";
    if (hours > 5) return hours + " часов назад";
  }

  let offsetHours = datePost.toLocaleString('ru-Ru', {timeZone: 'Europe/Moscow'});
  let position1 =  offsetHours.indexOf(', ');
  let position2 =  offsetHours.indexOf(':');
  let currentHours = offsetHours.slice(position1+1, position2);
  let dateArr = datePost;
  dateArr = [
    '0' + currentHours,
    '0' + dateArr.getMinutes(),
    '0' + dateArr.getDate(),
    '0' + (dateArr.getMonth() + 1),
    '' + dateArr.getFullYear(),
  ].map(component => component.slice(-2));
  return dateArr.slice(0, 2).join(':') + ' ' + dateArr.slice(2).join('.');
}

module.exports = new PostService();
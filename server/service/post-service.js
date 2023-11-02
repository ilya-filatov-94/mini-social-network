const {Post} = require('../models/models');




class PostService {
    async createNewPost(idUser, desc, image) {
        const post = await Relationship.create({
            idUser: idUser,
            desc: desc,
            image: image
        });
        return post;
    }
}

module.exports = new PostService();
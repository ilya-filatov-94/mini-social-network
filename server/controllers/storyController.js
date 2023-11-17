const StoryService = require('../service/story-service');
const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');


class StoryController {
    async createStory(request, response, next) {
        try {
            const {userId} = request.body;
            if (request.files) {
                const {image} = request.files;
                let typeImage = image.mimetype.replace('image/', '');
                let fileName = uuid.v4() + '.' + typeImage;
                image.mv(path.resolve(__dirname, '..', 'static', fileName));
                const story = await StoryService.createNewStory(parseInt(userId), fileName);
                return response.json(story);
            }
            return next(ApiError.forbidden('Ошибка при загрузке story', errors.array()));
        } catch (error) {
            next(error);
        }
    }

    async getAllStories(request, response, next) {
        try {     
            const {id} = request.query;      
            const stories = await StoryService.getAllStories(parseInt(id));
            const storiesData = excludeKeysFromArrObj(stories, ['userId', 'createdAt', 'updatedAt']);
            return response.json(storiesData);
            // return response.json(stories);
        } catch (error) {
            next(error);
        }
    }

    async getUserStory(request, response, next) {
        try {
            const {id} = request.query;
            const story = await StoryService.getOneStory(parseInt(id));
            return response.json(story);
        } catch (error) {
            next(error);
        }
    }

};

function excludeKeysFromArrObj(arr=[], keys=[]) {
    return arr.map(item => Object.fromEntries(Object.entries(item.dataValues)
            .filter(item => !keys.includes(item[0]))));
}



module.exports = new StoryController();
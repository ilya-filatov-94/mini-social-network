class Users {
  constructor() {
    this.noOfUsers = 0;
    this.relationshipList = new Map();
  }

  addUser(user) {
    this.noOfUsers++;
    this.relationshipList.set(user, []);
  }

  addFriend(user, friend) {
    this.relationshipList.get(user).push(friend);
    // this.relationshipList.get(friend).push(user); //двусторонняя подписка
  }

  get numberUsers() {
    return this.noOfUsers;
  }

  getFriendsOfUser(user) {
    return this.relationshipList.get(user);
  }

  getPossibleFriends(user) {
    const possibleFriendData = {};
    const visitedFriends = {};
    const neighbours = this.getFriendsOfUser(user);
    visitedFriends[user] = true;
    for (let item of neighbours) {
      visitedFriends[item] = true;
    }
    let item;
    for (let i = 0; i < neighbours.length; i++) {
      item = this.getFriendsOfUser(neighbours[i]);
      for (let j of item) {
        if (!visitedFriends[j]) {
          if (!possibleFriendData[j]) {
            possibleFriendData[j] = new Set();
            possibleFriendData[j].add(neighbours[i]);
          }
          if (possibleFriendData[j]) {
            possibleFriendData[j].add(neighbours[i]);
          }
        }
      }
    }
    return possibleFriendData;
  }
}

module.exports = Users;
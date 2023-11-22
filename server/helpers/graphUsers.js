class GraphUsers {
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
    this.relationshipList.get(friend).push(user);
  }

  removeFriend(user, friend) {
    const newArrFriends =  this.relationshipList.get(user).filter(item => item !== friend);
    this.relationshipList.set(user, newArrFriends);
  }

  get numberUsers() {
    return this.noOfUsers || 0;
  }

  getFriendsOfUser(user) {
    return this.relationshipList.get(user) || [];
  }

  getPossibleFriends(user) {
    if (!user) return {};
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

module.exports = GraphUsers;
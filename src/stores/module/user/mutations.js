import _ from "lodash";
export default {
  SAVE_USER(state, user) {
    const oldUsers = state.users;
    try {
      if (!_.isEmpty(user)) {
        let _new = {};
        if (_.isArrayLikeObject(user)) {
          _new = _.keyBy(user, u => `user_${u.id}`);
        } else if (_.isPlainObject(user)) {
          _new[`user_${user.id}`] = oldUsers[`user_${user.id}`]
            ? Object.assign(oldUsers[`user_${user.id}`], user)
            : user;
        }
        state.users = Object.assign({}, oldUsers, _new);
        window.$lstore.setData("H5_USERS", state.users);
      }
    } catch (e) {
      state.users = oldUsers;
    }
  }
};

import UserModel from '@models/user';

class UserDao {
  async createUser(ctx, v) {
    let user = await UserModel.findOne();
  }
}

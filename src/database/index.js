import Sequelize from 'sequelize';

import User from '../app/models/user';
import Recipients from '../app/models/recipient';
import File from '../app/models/file';
import Deliveryman from '../app/models/deliveryman';

import databaseConfig from '../config/database';

const models = [User, Recipients, File, Deliveryman];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();

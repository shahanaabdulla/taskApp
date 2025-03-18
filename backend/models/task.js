'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Define the association between Task and User models
      this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Task.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.STRING,
      userId: {  // Add the userId field as a foreign key to relate the task to a user
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // This should match the model name in your `User` table
          key: 'id',      // The primary key in the `Users` table
        },
      },
    },
    {
      sequelize,
      modelName: 'Task',
    }
  );

  return Task;
};

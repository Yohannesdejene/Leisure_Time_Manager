const { uid } = require("uid");
("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, Comment, CommentPost }) {
      // define association here
      User.hasMany(Post);
      User.hasMany(Comment);
      User.hasMany(CommentPost);
    }
  }
  User.init(
    {
      id: {
        set(value) {
          let x = uid(16);
          // Storing passwords in plaintext in the database is terrible.
          // Hashing the value with an appropriate cryptographic hash function is better.
          this.setDataValue("id", x);
        },
        type: DataTypes.STRING,
        primaryKey: true,
      },
      fname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      phonenumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

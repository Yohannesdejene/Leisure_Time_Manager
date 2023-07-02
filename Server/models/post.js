const { uid } = require("uid");
("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Picture, User, CommentPost }) {
      Post.hasMany(Picture);
      Post.belongsTo(User);
      Post.hasMany(CommentPost);
      // Post.hasMany(Likes);
    }
  }
  Post.init(
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

      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};

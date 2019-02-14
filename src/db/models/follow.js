'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id",
        as: "userId"
      }
    },
    artistId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Follow.associate = function(models) {
    // associations can be defined here
    Follow.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Follow.addScope("followedArtists", (userId) => {
      return {
        where: { userId: userId },
        order: [["createdAt", "DESC"]]
      }
    });
  };
  return Follow;
};
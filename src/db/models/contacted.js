'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contacted = sequelize.define('Contacted', {
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
    },
    albumId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Contacted.associate = function(models) {
    // associations can be defined here
    Contacted.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };
  return Contacted;
};
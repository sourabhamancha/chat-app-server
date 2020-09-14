"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Reaction }) {
      this.hasMany(Reaction, { as: "reactions" });
    }
  }
  Message.init(
    {
      content: DataTypes.STRING,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      from: DataTypes.STRING,
      to: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
    }
  );
  return Message;
};

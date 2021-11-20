const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const users =  sequelize.define('Users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "name_UNIQUE"
    },
    age: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    married: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "name_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });

  users.associate = (db) =>{
    db.Users.hasMany(db.Comments,{
      foreignKey : 'comenter' , 
      sourceKey : 'id'
    } );
  }

  return users;
};

const Sequelize = require('sequelize');

//여기서 sequelize -> sequelize = new Sequelize(config.database, config.username, config.password, config);
module.exports = function(sequelize, DataTypes) {
  
  const comments =  sequelize.define('Comments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    commenter: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'comments',
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
    ]
  });

  comments.associate = (db) => {
    db.Comments.belongsTo(db.Users ,{
        foreignKey : 'commenter' , 
        targetKey:'id'
      });
  }

  return comments;
};

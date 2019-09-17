const moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  const customers = sequelize.define('customers', {
    customer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    updated_at: {
      type: DataTypes.STRING(40),
      allowNull: true
    }
  }, {
    tableName: 'customers',
    timestamps: false
  })
  customers.associate = function (models) {
  }
  return customers
}

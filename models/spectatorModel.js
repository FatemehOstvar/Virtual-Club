const {
  addUser,
  getAllMessageContent,
  upgradeRole,checkUserExists,findById} = require('../db/queries');

module.exports = {
  addUser,
  getAllMessageContent,findById,
  upgradeRole,checkUserExists}

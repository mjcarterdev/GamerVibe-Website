'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();
const {errorJson} = require('../utils/json_messages');

// TODO: Get correct information from users
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT username, email FROM User WHERE deleted_at IS NULL AND banned_at IS NULL',
    );
    // console.log('userModel getAllUsers rows', rows);
    return rows;
  } catch (e) {
    return errorJson(e.message);
  }
};

const getUser = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT u.user_id, u.username, u.fname, u.lname, u.email, u.imagename, ' +
        'u.theme, u.discord, u.youtube, u.twitch, u.private_acc, u.created_at ' +
        'FROM User AS u ' +
        'WHERE user_id = ? ' +
        'AND deleted_at IS NULL ' +
        'AND banned_at IS NULL',
        [id],
    );
    // console.log('userModel getUser user', rows[0])
    return rows[0] ? {...rows[0]} : errorJson(`No users found with id: ${id}`);
  } catch (e) {
    return errorJson(e.message);
  }
};

const getUserLogin = async (email) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT u.user_id, u.username, u.fname, u.lname, u.email, u.passwd, ' +
        'u.imagename, u.theme, u.discord, u.youtube, u.twitch, u.created_at, ' +
        'u.private_acc, m.moderator_since ' +
        'FROM User AS u ' +
        'LEFT JOIN Moderator AS m ' +
        'ON u.user_id = m.moderator_id ' +
        'AND (m.moderator_until IS NULL ' +
        'OR TIMESTAMPDIFF(MINUTE, m.moderator_until, NOW()) < 0) ' +
        'WHERE u.email = ? ' +
        'AND u.deleted_at IS NULL ' +
        'AND u.banned_at IS NULL', [email],
    );
    // console.log('userModel getUserLogin rows', rows);
    return rows;
  } catch (e) {
    return errorJson(e.message);
  }
};

const updateUser = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'UPDATE User ' +
        'SET fname = ?, ' +
        'lname = ?, ' +
        'imagename = ?, ' +
        'discord = ?, ' +
        'youtube = ?, ' +
        'twitch = ?, ' +
        'private_acc = ? ' +
        'WHERE user_id = ? ' +
        'AND deleted_at IS NULL ' +
        'AND banned_at IS NULL', params,
    );
    // console.log('userModel updateUser rows', rows);
    return rows;
  } catch (e) {
    // console.error('userModel updateUser error', e.message);
    return errorJson(e.message);
  }
};

const addUser = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO User(username, email, passwd) VALUES(?,?,?)', params);
    // console.log('addUser rows', rows);

    return await getUser(rows['insertId']);
  } catch (e) {
    // console.error('addUser error', e.message);

    // Email or username is already in use
    if (e.code === 'ER_DUP_ENTRY') {
      const sliced = e.message.split('\'');
      const key = sliced[sliced.length - 2];
      return errorJson(`${key} already in use`);
    }
    return errorJson(e.message);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  getUserLogin,
  addUser,
  updateUser,
};
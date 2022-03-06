'use strict';

module.exports = app => {
  const { validator } = app;

  validator.addRule('userName', (rule, value) => {
    if (!/^[a-zA-Z0-9_-]{4,16}$/.test(value)) {
      return 'userName should only includes a-Z0-9_- and in length 4-16';
    }
  });

  validator.addRule('password', (rule, value) => {
    if (!/^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/.test(value)) {
      return 'password should includes uppercase letters, lowercase letters, numbers and special characters';
    }
  });

  validator.addRule('dob', (rule, value) => {
    if (!/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/.test(value)) {
      return 'dob should be format YYYY-MM-DD';
    }
  });
};

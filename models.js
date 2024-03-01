const { EntitySchema } = require('typeorm');

class LotteryTicket {
  constructor(id, ticket_code, result, used, use_count) {
    this.id = id;
    this.ticket_code = ticket_code;
    this.result = result;
    this.used = used;
    this.use_count = use_count;
  }
}

const LotteryTicketSchema = new EntitySchema({
  name: 'LotteryTicket',
  target: LotteryTicket,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    ticket_code: {
      type: 'varchar',
      length: 50,
      unique: true
    },
    result: {
      type: 'varchar',
      length: 50,
      nullable: true
    },
    used: {
      type: 'boolean',
      default: false
    },
    use_count: {
      type: 'int',
      default: 0
    }
  }
});

class AdminUser {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  verify_password(password) {
    return this.password === password;
  }
}

const AdminUserSchema = new EntitySchema({
  name: 'AdminUser',
  target: AdminUser,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    username: {
      type: 'varchar',
      length: 20,
      unique: true
    },
    password: {
      type: 'varchar',
      length: 128
    }
  }
});

module.exports = { LotteryTicketSchema, AdminUserSchema };

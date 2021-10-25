const {Sequelize} = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");
const KanbanBoards = require('./models/boards');

return sequelize.authenticate()
    .then(result => {
        console.log(`SQLite successfully connected!`);
        return KanbanBoards.sync();
    })
    .then(result => {
        console.log(`Kanban Board table created`);
        return result;
    })
    .catch(error => {
        console.error('Unable to connect to SQLite database:', error);
    })

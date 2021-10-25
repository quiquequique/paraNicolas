const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const BlueBird = require('bluebird');
const Boards = require('../models/boards');

chai.use(chaiHttp);

const setup = (...ratings) => {
    return BlueBird.mapSeries(ratings, rating => {
        return chai.request(server)
            .post('/boards')
            .send(rating)
            .then(response => {
                return response.body;
            })
    })
}

describe('kanban_boards_api', () => {
    const item_1 = {
        title: 'Create Node Project'
    }

    const item_2 = {
        title: 'Learn Event Loop'
    }

    const item_3 = {
        title: 'Create a Kanban Board Project'
    }

    beforeEach(async () => {
        await Boards.sync();
    })

    afterEach(async () => {
        await Boards.drop();
    })

    it('should create a new item in the board', async () => {
        const response = await chai.request(server).post('/boards').send(item_1)
        response.should.have.status(201);
        response.body.id.should.exist;
        delete response.body.id;
        response.body.should.eql({...item_1, stage: 1})
    });

    it('should update the stage for the item', async () => {
        await setup(item_1, item_2);
        const response = await chai.request(server).put('/boards/1').send({stage: 3})
        response.should.have.status(200);
        delete response.body.id;
        response.body.should.eql({...item_1, stage: 3})
    })

    it('should return with status 400 if the stage is not valid', async () => {
        await setup(item_1, item_2, item_3);
        const response = await chai.request(server).put('/boards/1').send({stage: 4})
        response.should.have.status(400);
    })

    it('should update the stages correctly for a series of requests', async () => {
        await setup(item_1, item_2, item_3);
        await BlueBird.mapSeries([[1, 2], [2, 3], [3, 1], [1, 1], [3, 3], [1, 2]], data => {
            return chai.request(server).put(`/boards/${data[0]}`).send({stage : data[1]})
                .then(response => {
                    response.status.should.eql(200);
                    let item;
                    switch (data[0]) {
                        case 1:
                            item = item_1;
                            break;

                        case 2:
                            item = item_2;
                            break;

                        case 3:
                            item = item_3;
                            break;
                    }
                    delete response.body.id;
                    response.body.should.eql({...item, stage: data[1]})
                })
        })
    })

});

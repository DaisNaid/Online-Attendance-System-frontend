import chai from 'chai';
import chaiHTTP from 'chai-http'; //Allows API calling through HTTP protocol
import server from '../server.js'; //API router with all the class functionalities

chai.should();
chai.use(chaiHTTP);

describe('Class API', () => {
  //GET route
  describe('GET /api/classes', () => {
    it('should GET every class', (done) => {
      chai
        .request(server)
        .get('/api/classes/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should NOT GET every class', (done) => {
      chai
        .request(server)
        .get('/api/classe')
        .end((err, res) => {
          res.should.have.status(404);
          done(err);
        });
    });
  });

  //GET by ID route
  describe('GET /api/classes/:id', () => {
    it('should GET a class by ID', (done) => {
      const classID = '62b1ebd04e69caa74326d43c';
      chai
        .request(server)
        .get('/api/classes/:id' + classID)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          done();
        });
    });

    it('should NOT GET a class by ID', (done) => {
      const classID = '62b1ebd04e69caa74326d47z';
      chai
        .request(server)
        .get('/api/classes/:id' + classID)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('Class Not Found');
          done(err);
        });
    });
  });

  //POST route
  describe('POST /api/classes', () => {
    it('should POST a new class', (done) => {
      //classe is used because class is an environment variable
      const classe = {
        isOpen: false,
        course: '62b1ebd04e69caa74326d43c',
      };
      chai
        .request(server)
        .post('/api/classes/')
        .send(classe)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          done();
        });
    });

    it('should NOT POST a new class without the course property', (done) => {
      //classe is used because class is an environment variable
      const classe = {
        isOpen: false,
        course: '62b1ebd04e69caa74326d43c',
      };
      chai
        .request(server)
        .post('/api/classes/')
        .send(classe)
        .end((err, res) => {
          res.should.have.status(400);
          done(err);
        });
    });
  });

  //PUT route
  describe('PUT /api/classes/:id', () => {
    it('should PUT in a class by ID ', (done) => {
      const classID = '62b1ebd04e69caa74326d43c';
      //classe is used because class is an environment variable
      const classe = {
        isOpen: true,
      };
      chai
        .request(server)
        .put('/api/classes/:id' + classID)
        .send(classe)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.have.property('isOpen').eq(true);
          done();
        });
    });

    it('should NOT PUT in a class by ID ', (done) => {
      const classID = '62b1ebd04e69caa74326d43c';
      //classe is used because class is an environment variable
      const classe = {
        isOpen: {},
      };
      chai
        .request(server)
        .put('/api/classes/:id' + classID)
        .send(classe)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.have.property('isOpen').eq(false); //isOpen has a default value of false
          done(err);
        });
    });
  });
});

import os from 'os';
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from './index.js';



describe('App startup', function() {
  it('should respond on port 3000', function(done) {
    request(app)
      .get('/') 
      .expect(200, done); 
  });

  it('should log memory usage', function() {
    const memoryUsage = process.memoryUsage();
    const heapUsedMb = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const rssMb = (memoryUsage.rss / 1024 / 1024).toFixed(2);
    console.log(`Memory Usage: Heap Used: ${heapUsedMb} MB, RSS: ${rssMb} MB`);
  });

  it('should log CPU load', function() {
    const cpus = os.cpus();
    let userCpuLoad = 0;
    cpus.forEach((cpu) => {
      userCpuLoad += cpu.times.user;
    });
    userCpuLoad = userCpuLoad / cpus.length; 
    console.log(`CPU Load: ${userCpuLoad}`);
  });


  it('should connect to the database successfully', async function() {
    const mongoDBTestUri = "mongodb+srv://dbkarim:Miirak17@cluster0.os5qpdf.mongodb.net/?retryWrites=true&w=majority";
    await mongoose.connect(mongoDBTestUri);
    const db = mongoose.connection;
    expect(db.readyState).to.equal(1); 
    await mongoose.disconnect();
  });

  it('should register a new user', function(done) {
    const newUser = { userName: "testUser", password: "testPass" };

    request(app)
      .post('/signup') 
      .send(newUser)
      .expect(200) 
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('should login the user', function(done) {
    const userCredentials = { userName: "testUser", password: "testPass" };

    request(app)
      .post('/login')
      .send(userCredentials)
      .expect(302) 
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.header).to.have.property('location').that.equals('home.html');
        done();
      });
  });

  it('should return a valid chatbot response', function(done) {
    const userMessage = { message: "Hello" };
    request(app)
      .post('/chat') 
      .send(userMessage)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('message').that.is.a('string');
        done();
      });
  });

});



//the packages and variables needed for setup
const request = require('supertest') //this is the thing that lets us run our code like  postman
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')//this creates the fake mongo database that exists on our computer in our memory not on atlas 
const app  = require('../app') //this is our api application that we made with express this is the thing we are giving to supertest to test 
const server = app.listen(8080, () => console.log('Testing on PORT 8080')) 
const User = require('../models/user') //this is for us to be able to do crud operation on the User
let mongoServer


//what needs to happen before the test runs 
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create() //function to make the memory server
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
  await mongoose.connection.close() //after the testing is complete this shuts off mongoose connection with mongoose db
  mongoServer.stop()
  server.close()
})

afterAll((done) => done())

describe('Test suite for the /users routes on our api', () => {
  test('It should create a new user in the db', async () => { //first param description of the test you want to run
    const response = await request(app)
      .post('/users')
      .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
    
    expect(response.statusCode).toBe(200) 
    expect(response.body.user.name).toEqual('John Doe')
    expect(response.body.user.email).toEqual('john.doe@example.com')
    expect(response.body).toHaveProperty('token')
  })

  test('It should login a user', async () => {
    const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
    await user.save()

  //test for users/login
    const response = await request(app)
      .post('/users/login')
      .send({ email: 'john.doe@example.com', password: 'password123' })
    
    expect(response.statusCode).toBe(200)
    expect(response.body.user.name).toEqual('John Doe')
    expect(response.body.user.email).toEqual('john.doe@example.com')
    expect(response.body).toHaveProperty('token')
  })

  test('It should update a user', async () => {
    const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
    await user.save()
    const token = await user.generateAuthToken()

  //test for users/:id update
    const response = await request(app)
      .put(`/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Jane Doe', email: 'jane.doe@example.com' })
    
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toEqual('Jane Doe')
    expect(response.body.email).toEqual('jane.doe@example.com')
  })

//test for user/:id delete
  test('It should delete a user', async () => {
    const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
    await user.save()
    const token = await user.generateAuthToken()

    const response = await request(app)
      .delete(`/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('User deleted')
  })
})
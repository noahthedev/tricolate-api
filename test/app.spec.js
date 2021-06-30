const app = require('../src/app')
const knex = require('knex')

describe('Recipes API:', () => {
  let db;
  let recipes = [
    {
      "title": "recipe 1",
      "abstract": "asdf",
      "coffee": 1,
      "grind": "fine",
      "water": 100, 
      "method": "lorem ipsum"
    },
    {
      "title": "recipe 2",
      "abstract": "asdf",
      "coffee": 2,
      "grind": "medium",
      "water": 200, 
      "method": "lorem ipsum"
    },
    {
      "title": "recipe 3",
      "abstract": "asdf",
      "coffee": 3,
      "grind": "coarse",
      "water": 300, 
      "method": "lorem ipsum"
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  });

  before('cleanup', () => db.raw('TRUNCATE TABLE recipes RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE recipes RESTART IDENTITY;')); 

  after('disconnect from the database', () => db.destroy());

  describe('App', () => {
    it('GET / responds with 200 containing "Hello, world!"', () => {
      return supertest(app)
        .get('/')
        .expect(200, 'Hello, world!')
    })
  })

  describe('GET /recipes', () => {
    
    beforeEach('insert some recipes', () => {
      return db('recipes').insert(recipes);
    })

    it('should respond to GET `/recipes` with an array of recipes and status 200', () => {
      return supertest(app)
        .get('/recipes')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(recipes.length);
          res.body.forEach((recipe) => {
            expect(recipe).to.be.a('object');
            expect(recipe).to.include.keys('id', 'title', 'abstract', 'coffee', 'grind', 'water', 'method');
          });
        });
    });
  });

  describe('GET /recipes/:id', () => {

    beforeEach('insert some recipes', () => {
      return db('recipes').insert(recipes);
    })

    it('should return correct recipe when provided an id', () => {
      let rep;
      return db('recipes')
      .first()
      .then(_rep => {
        rep = _rep
        return supertest(app)
          .get(`/recipes/${rep.id}`)
          .expect(200);
      })
      .then(res => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'abstract', 'coffee', 'grind', 'water', 'method');
        expect(res.body.id).to.equal(rep.id);
        expect(res.body.title).to.equal(rep.title);
      });
    });

    it('should response with a 404 when given an invalid id', () => {
      return supertest(app)
        .get('/recipes/123456789')
        .expect(404);
    });
  });

  describe('POST /recipes', () => {

    it('should create and return a new recipe when provided valid data', () => {
      const newRecipe = {
        "title": "recipe 1",
        "abstract": "asdf",
        "coffee": 1,
        "grind": "fine",
        "water": 100, 
        "method": "lorem ipsum"
      };

      return supertest(app)
        .post('/recipes')
        .send(newRecipe)
        .expect(201)
        .expect( res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'abstract', 'coffee', 'grind', 'water', 'method', 'link');
          expect(res.body.title).to.equal(newRecipe.title);
          expect(res.headers.location).to.equal(`/recipes/${res.body.id}`)
        })
    })
  });

  describe('DELETE /recipes/:id', () => {

    beforeEach('insert some recipes', () => {
      return db('recipes').insert(recipes);
    })

    it('should delete a recipe by id', () => {
      return db('recipes')
        .first()
        .then(rep => {
          return supertest(app)
            .delete(`/recipes/${rep.id}`)
            .expect(204);
        })
    });

    it('should respond with a 404 for an invalid id', () => {
      return supertest(app)
        .delete('/recipes/123456789')
        .expect(404);
    });
  });
});
 

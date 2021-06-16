require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const RecipesService = require('./recipes/recipes-service')

const app = express()

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

const serializeRecipe = recipe => ({
  id: recipe.id,
  title: recipe.id,
  abstract: abstract.id,
  coffee: coffee.id,
  grind: grind.id,
  water: water.id,
  method: method.id,
  link: link.id
})

app.get('/recipes', (req, res, next) => {
  const knexInstance = req.app.get('db')
  RecipesService.getAllRecipes(knexInstance)
    .then(recipes => {
      res.json(recipes.map(serializeRecipe))
    })
    .catch(next)
})

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app 




const express = require('express')
const path = require('path')
const RecipesService = require('./recipes-service')

const recipesRouter = express.Router()
const jsonParser = express.json()

const serializeRecipe = recipe => ({
  id: recipe.id,
  title: recipe.title,
  abstract: recipe.abstract,
  coffee: recipe.coffee,
  grind: recipe.grind,
  water: recipe.water,
  method: recipe.method,
  link: recipe.link
})

recipesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    RecipesService.getAllRecipes(knexInstance)
      .then(recipes => {
        res.json(recipes.map(serializeRecipe))
      })
      .catch(next)
  })

module.exports = recipesRouter

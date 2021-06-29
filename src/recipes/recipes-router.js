const express = require('express')
const path = require('path')
const RecipesService = require('./recipes-service')
const xss = require('xss')

const recipesRouter = express.Router()
const jsonParser = express.json()

const serializeRecipe = recipe => ({
  id: recipe.id,
  title: xss(recipe.title),
  abstract: xss(recipe.abstract),
  coffee: recipe.coffee,
  grind: xss(recipe.grind),
  water: recipe.water,
  method: xss(recipe.method),
  link: xss(recipe.link)
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
  .post(jsonParser, (req, res, next) => {
    const { title, abstract, coffee, grind, water, method, link } = req.body

    const newRecipe = { title, abstract, coffee, grind, water, method, link }

    RecipesService.insertRecipe(
      req.app.get('db'), newRecipe
    )
      .then(recipe => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${recipe.id}`))
          .json(serializeRecipe(recipe))
      })
      .catch(next)
  })

  recipesRouter
    .route('/:id')
    .all((req, res, next) => {
      const knexInstance = req.app.get('db')
      RecipesService.getById(
        knexInstance,
        req.params.id
      )
        .then(recipe => {
          if (!recipe) {
            return res.status(404).json({
              error: { message: `Recipes doesn't exist` }
            })
          }
          res.recipe = recipe
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
      res.json(serializeRecipe(res.recipe))
    })

module.exports = recipesRouter

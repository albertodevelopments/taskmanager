'use strict'

const Movie = require('../models/Movie')
const Project = require('../models/Project')

exports.createProject = async (req, res) => {
  try {
    // Creamos un nuevo proyecto
    const project = new Project(req.body)
    const { name } = project

    // Recuperamos el id del usuario desde el middleware si se ha validado el token
    project.userId = req.user.id

    // No puede haber dos proyectos con el mismo nombre
    const sameNameProject = await Project.find({ name })
    if (sameNameProject && sameNameProject.length > 0) {
      return res
        .status(500)
        .json({ msg: 'There is already a project with this name' })
    }

    // Guardamos la película
    await movie.save()
    res.json({ msg: 'Project added successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'An error has ocurred' })
  }
}

exports.getProjects = async (req, res) => {
  // Extraemos los filtros de los parámetros
  const filters = { ...req.query }

  if (filters.skip) delete filters.skip
  if (filters.limit) delete filters.limit

  filters.userId = req.user.id

  // Extraemos los valores de la paginación
  const { skip, limit } = req.query

  try {
    const projects = await Project.find(filters)
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
    res.status(200).json({ projects })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'An error has ocurred' })
  }
}

exports.updateProject = async (req, res) => {
  const newProject = {}

  // Obtenemos los campos actualizados del proyecto
  const { name, description, status, progress } = req.body
  let { startDate, endDate } = req.body

  try {
    // Validamos que el proyecto exista
    let project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ msg: 'This project does not exist' })
    }

    // Validamos que el usuario actual coincida con el de la autenticación
    if (project.userId.toString() !== req.user.id) {
      return res
        .status(500)
        .json({ msg: 'Error en la autenticación del usuario' })
    }

    if (!(new Date(startDate) instanceof Date)) startDate = null
    if (!(new Date(endDate) instanceof Date)) endDate = null

    // Actualizamos valores en el nuevo objeto y guardamos
    newProject.name = name
    newProject.description = description
    newProject.status = status
    newProject.progress = progress
    newProject.startDate = startDate
    newProject.endDate = endDate

    project = await project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    )
    res.status(200).json({ project })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'An error has ocurred' })
  }
}

exports.deleteProject = async (req, res) => {
  // Validamos que el proyecto exista
  let project = await Project.findOne({ _id: req.params.id })

  if (!project) {
    return res.status(404).json({ msg: 'This project does not exist' })
  }

  // Validamos que el usuario del proyecto sea el mismo que se ha autenticado
  if (project.userId.toString() !== req.user.id) {
    return res.status(500).json({ msg: 'Authentication error' })
  }

  try {
    await Project.findOneAndRemove({ _id: req.params.id })
    return res.status(200).json({ msg: 'Project removed successfully' })
  } catch (error) {
    console.log(error)
    res.status.send(500).json({ msg: 'An error has ocurred' })
  }
}

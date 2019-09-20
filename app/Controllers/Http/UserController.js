'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {

  async index({ response }) {
    let user = await User.all()

    return response.json(user)
  }

  async show({ params, response }) {
    let user = await User.find(params.id)

    return response.json(user)
  }

  async store({ request, response }) {

    const { username, email, password } = request.only(['username', 'email', 'password'])

    const rules = {
      email: 'required|email|unique:users',
      password: 'required|min:5'
    }

    const data = {
      username: username,
      email: email,
      password: password
    }

    const validation = await validate(data, rules)

    if (validation.fails()) 
      return response.status(500).json({ error: validation.messages() })
    
    const user = await User.create(data)
    return response.status(201).json(user)
  }

  async update({ params, request, response }) {

    let user = await User.find(params.id)
    if (!user) return response.status(404).json({data: 'User not found'})

    const { username, email, password } = request.only(['username', 'email', 'password'])

    const rules = {
      email: 'required|email|unique:users',
      password: 'required|min:5'
    }

    const data = {
      username: username,
      email: email,
      password: password
    }
    
    const validation = await validate(data, rules)

    if (validation.fails()) 
      return response.status(500).json({ error: validation.messages() })

    user.username = username
    user.email = email
    user.password = password

    await user.save()
    return response.status(200).json(user)
  }

  async delete({ params, response }) {
    let user = await User.find(params.id)
    if (!user) return response.status(404).json({data: 'User not found'})

    await user.delete()
    return response.status(204).json(null)
  }

}

module.exports = UserController

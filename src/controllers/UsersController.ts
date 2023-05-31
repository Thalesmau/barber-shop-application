import { Request, Response, NextFunction } from 'express'
import { UsersService } from '../services/UsersService'

class UsersController {
  private usersServices: UsersService
  constructor() {
    this.usersServices = new UsersService()
  }

  index() {
    // Buscar todos
  }

  show() {
    // Buscar somente um
  }

  async store(request: Request, response: Response, next: NextFunction) {
    // Criar
    const { name, email, password } = request.body
    try {
      const result = await this.usersServices.create({ name, email, password })

      return response.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  async auth(request: Request, response: Response, next: NextFunction) {
    // Autenticação do usuário
    const { email, password } = request.body
    try {
      const result = await this.usersServices.auth(email, password)
      return response.json(result)
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, oldPassword, newPassword } = request.body
    const { userId } = request
    try {
      const result = await this.usersServices.update({
        name,
        oldPassword,
        newPassword,
        avatarUrl: request.file,
        userId,
      })
      return response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}

export { UsersController }

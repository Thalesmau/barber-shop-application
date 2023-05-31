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

  auth() {
    // Autenticação do usuário
  }
}

export { UsersController }

import { compare, hash } from 'bcrypt'
import { ICreate, IUpdate } from '../interfaces/UsersInterface'
import { UsersRepository } from '../repositories/UsersRepository'
import { s3 } from '../config/aws'
import { v4 as uuid } from 'uuid'
import { sign } from 'jsonwebtoken'

class UsersService {
  private usersRepository: UsersRepository
  constructor() {
    this.usersRepository = new UsersRepository()
  }

  async create({ name, email, password }: ICreate) {
    const findUser = await this.usersRepository.findUserByEmail(email)

    if (findUser) {
      throw new Error('User exists')
    }
    const hashPassword = await hash(password, 10)

    const create = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    })
    return create
  }

  async update({ name, oldPassword, newPassword, avatarUrl, userId }: IUpdate) {
    let password
    if (oldPassword && newPassword) {
      const findUserById = await this.usersRepository.findUserById(userId)
      if (!findUserById) {
        throw new Error('User not found.')
      }
      const passwordMatch = compare(oldPassword, findUserById.password)
      if (!passwordMatch) {
        throw new Error('Password invalid.')
      }
      password = await hash(newPassword, 10)
      await this.usersRepository.updatePassword(password, userId)
    }

    if (avatarUrl) {
      const uploadImage = avatarUrl?.buffer
      const uploadS3 = await s3
        .upload({
          Bucket: 'hero-week-react',
          Key: `${uuid()}-${avatarUrl?.originalname}`,
          // ACL: 'public-read',
          Body: uploadImage,
        })
        .promise()
      console.log('Entrou', uploadS3.Location)
      await this.usersRepository.update(name, uploadS3.Location, userId)
    }
    return {
      message: 'User updated successfully',
    }
  }

  async auth(email: string, password: string) {
    const findUser = await this.usersRepository.findUserByEmail(email)

    if (!findUser) {
      throw new Error('User or password invalid.')
    }
    const passwordMatch = await compare(password, findUser.password)

    if (!passwordMatch) {
      throw new Error('User or password invalid.')
    }

    const secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN
    if (!secretKey) {
      throw new Error('There is no token key.')
    }

    const token = sign({ email }, secretKey, {
      subject: findUser.id,
      expiresIn: 60 * 25,
    })

    return {
      token,
      user: {
        name: findUser.name,
        email: findUser.email,
      },
    }
  }
}

export { UsersService }

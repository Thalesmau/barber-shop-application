export interface ICreate {
  name: string
  email: string
  password: string
}

interface FileUpload {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

export interface IUpdate {
  name: string
  oldPassword: string
  newPassword: string
  avatarUrl?: FileUpload
  userId: string
}

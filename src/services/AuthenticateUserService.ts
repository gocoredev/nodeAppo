import {getRepository} from 'typeorm'
import {compare} from 'bcryptjs'
import {sign, /* verify */} from 'jsonwebtoken'
import authConfig from '../config/auth'


import User from '../models/User'
import AppError from '../errors/AppError'
interface Request {
    email: string;
    password: string;
}

export default class AuthenticateUserService {

    public async execute ({email, password}:Request):Promise<{user: User, token: string}>{
        const usersRepository = getRepository(User)

        const user = await usersRepository.findOne({
            where: {email}
        })

        if (!user) throw new AppError('Incorrect e-mail/password combination', 401)


        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) throw new AppError('Incorrect e-mail/password combination', 401)

        const token = sign({}, authConfig.jwt.secret, {subject: user.id, expiresIn: authConfig.jwt.expiresIn,})

        return {
            user,
            token
        }
    }
}
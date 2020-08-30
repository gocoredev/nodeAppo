import {getRepository} from 'typeorm'
import {compare} from 'bcryptjs'
import {sign, /* verify */} from 'jsonwebtoken'

import User from '../models/User'
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

        if (!user) throw Error('Incorrect e-mail/password combination')


        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) throw Error('Incorrect e-mail/password combination')

        const token = sign({}, 'db7cb1c50676a561b5f6b85553947608', {subject: user.id, expiresIn: '1d',})

        return {
            user,
            token
        }
    }
}
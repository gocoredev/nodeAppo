import {Router, request, response} from 'express'
import CreateUserService from '../services/CreateUserService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import multer from 'multer'
import uploadConfig from '../config/uploadConfig'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'


const usersRouter = Router()
const uplodad = multer(uploadConfig)

usersRouter.post('/', async (request, response)=>{
    const {name, email, password} = request.body

    const createUser = new CreateUserService()

    const user = await createUser.execute({
        name,email, password
    })

    if (user) delete user['password']

    return response.json(user)
})

usersRouter.patch('/avatar', ensureAuthenticated, uplodad.single('avatar'), async (request, response)=>{

    const updateUserAvatar = new UpdateUserAvatarService()
    const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename
    })

    return response.json(user)
    
})



export default usersRouter;
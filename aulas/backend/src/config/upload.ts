import multer from 'multer'
import path from 'path'

export default {
    storage: multer.diskStorage({
        destination: path.join(__dirname, '..', '..', 'uploads'),
        filename: (request, file, callback) => {
            const fileName = `${file.originalname.split('.')[0]}-${Date.now()}.${file.originalname.split('.')[1]}`
            callback(null, fileName)
        }
    })
}
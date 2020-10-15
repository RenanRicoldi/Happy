import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Orphanage from '../models/Orphanages'
import OrphanageView from '../views/orphanagesView'

export default {
    async create(request: Request, response: Response) {
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = request.body
    
        try {
            const orphanageRepository = getRepository(Orphanage)

            const requestImages = request.files as Express.Multer.File[]
            const images = requestImages.map( image => {return { path: image.filename } } )
    
            const orphanage = orphanageRepository.create({
                name,
                latitude,
                longitude,
                about,
                instructions,
                opening_hours,
                open_on_weekends: open_on_weekends === 'true',
                images
            })
    
            await orphanageRepository.save(orphanage)
        } catch(error) {
            return response.status(400).json({ message: 'Error creating orphanage.' })
        }
    
        return response.status(201).json({ message: `Orphanage ${name} created.`})
    },

    async index(request: Request, response: Response) {
        const orphanageRepository = getRepository(Orphanage)

        try {
            const orphanages = await orphanageRepository.find({
                relations: ['images']
            })

            return response.status(200).json(OrphanageView.renderMany(orphanages))
        } catch(error) {
            return response.status(200).json({ message: 'Error indexing orphanages.' })
        }

    },

    async findById(request: Request, response: Response) {
        const { id } = request.params

        const orphanageRepository = getRepository(Orphanage)

        try {
            const orphanage = await orphanageRepository.findOneOrFail(id, {
                relations: ['images']
            })

            return response.status(200).json(OrphanageView.render(orphanage))
        } catch(error) {
            return response.status(200).json({ message: `Error indexing orphanage with ID ${id}.` })
        }
    }
}
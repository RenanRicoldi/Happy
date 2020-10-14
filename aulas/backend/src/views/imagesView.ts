import Images from "../models/Images"

const url = process.env.URL

export default {
    render(image: Images) {
        return {
            id: image.id,
            url: `${url}/uploads/${image.path}`
        }
    },
    renderMany(images: Images[]) {
        return images.map( image => this.render(image))
    }
}
import { config, uploader } from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config();


const cloudinaryConfig = (req, res, next) => {
config({
cloud_name: 'bestpeers',
api_key: 141465412341571,
api_secret: 'htOqLvaox89fGnmYyKknP3FRevk',
});
next();
}
export { cloudinaryConfig, uploader };


// cloudinary.config({
// cloud_name: 'code-freak',
// api_key: '141465412341571',
// api_secret: 'htOqLvaox89fGnmYyKknP3FRevk'
// });

// exports.uploads = (file) =>{
//     return new Promise(resolve => {
//     cloudinary.uploader.upload(file, (result) =>{
//     resolve({url: result.url, id: result.public_id})
//     }, {resource_type: "auto"})
// })
// }
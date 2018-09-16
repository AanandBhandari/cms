if (process.env.NODE_ENV === 'production') {
    module.exports = {
        clientID : '254625219789-74lkrgml17udjvubfmeckdd616scpueg.apps.googleusercontent.com',
        clientSecret : 'TvIC_9obdi8toIWBl_1AWB1U',
        callbackURL: 'https://postany.herokuapp.com/google/redirect'
    }
} else {
     module.exports = {
        clientID : '254625219789-74lkrgml17udjvubfmeckdd616scpueg.apps.googleusercontent.com',
        clientSecret : 'TvIC_9obdi8toIWBl_1AWB1U',
        callbackURL: 'http://localhost:3000/google/redirect'
     }
}
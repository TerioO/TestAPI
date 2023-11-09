import { CorsOptions } from "cors";

const whitelist = [
    ""
]

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (origin && whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
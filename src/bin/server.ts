import { Server } from "http"
import { config } from "../config"
import { app } from "../app"

let server: Server

export const main = () => {
    server = app.listen(config.port)
    console.log(`${config.appName} is listening on port ${config.port}`)
}

main()


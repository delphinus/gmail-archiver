import { OAuth2Client } from "google-auth-library"
import { gmail_v1 } from "googleapis"
import { authorize } from "./authorize"
import { generateMessages } from "./generate-messages"

const listMessages = async (auth: OAuth2Client) => {
    for await (const message of generateMessages(auth)) {
        console.log(message.id)
    }
}
;(async () => {
    try {
        const auth = await authorize()
        await listMessages(auth)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
})()

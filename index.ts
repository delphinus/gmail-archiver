import { OAuth2Client } from "google-auth-library"
import { gmail_v1 } from "googleapis"
import { Archive } from "./archive"
import { authorize } from "./authorize"
import { generateMessages } from "./generate-messages"
;(async () => {
    try {
        const auth = await authorize()
        const archiver = new Archive(auth)
        for await (const message of generateMessages(auth)) {
            await archiver.parse(message)
        }
        await archiver.end()
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
})()

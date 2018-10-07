import { OAuth2Client } from "google-auth-library"
import { gmail_v1 } from "googleapis"
import { authorize } from "./authorize"

const listLabels = async (auth: OAuth2Client) => {
    const gmail = new gmail_v1.Gmail({ auth })
    const res = await gmail.users.labels.list({ userId: "me" })
    const labels = res.data.labels
    if (!labels || !labels.length) {
        console.log("No labels found")
        return
    }
    labels.forEach(label => console.log(`- ${label.name}`))
}
;(async () => {
    try {
        const auth = await authorize()
        await listLabels(auth)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
})()

import { OAuth2Client } from "google-auth-library"
import { gmail_v1 } from "googleapis"

// node8 generator fix
// https://github.com/Microsoft/TypeScript/issues/14151#issuecomment-280812617
;(Symbol as any).asyncIterator =
    Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator")

const messagesQuery = "is:read in:inbox"
const maxResults = 1000

export async function* generateMessages(
    auth: OAuth2Client,
): AsyncIterableIterator<gmail_v1.Schema$Message> {
    const gmail = new gmail_v1.Gmail({ auth })
    let i = 0
    let pageToken: string | undefined
    while (true) {
        const res = await gmail.users.messages.list({
            maxResults,
            pageToken,
            q: messagesQuery,
            userId: "me",
        })
        const messages = res.data.messages
        if (!messages || !messages.length) {
            console.log("finish reading messages")
            return
        }
        const estimated = res.data.resultSizeEstimate
        console.log(`${i + messages.length} / ${estimated} messages found`)
        for (const message of messages) {
            i++
            yield message
        }
        pageToken = res.data.nextPageToken
        if (!pageToken) {
            break
        }
    }
}

import { OAuth2Client } from "google-auth-library"
import { gmail_v1 } from "googleapis"

// node8 generator fix
// https://github.com/Microsoft/TypeScript/issues/14151#issuecomment-280812617
;(Symbol as any).asyncIterator =
    Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator")

export async function* generateMessages(
    auth: OAuth2Client,
): AsyncIterableIterator<gmail_v1.Schema$Message> {
    const gmail = new gmail_v1.Gmail({ auth })
    const res = await gmail.users.messages.list({
        maxResults: 10,
        q: "is:read in:inbox",
        userId: "me",
    })
    const messages = res.data.messages
    if (!messages || !messages.length) {
        console.log("finish")
        return
    }
    const estimated = res.data.resultSizeEstimate
    console.log(`${messages.length} / ${estimated} messages found`)
    for (const message of messages) {
        yield message
    }
}

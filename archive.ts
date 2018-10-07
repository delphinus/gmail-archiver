import { OAuth2Client } from "google-auth-library"
import { gmail_v1 } from "googleapis"

const MAX_IDS_CHUNK = 1000

export class Archive {
    private gmail: gmail_v1.Gmail
    private ids: string[] = []
    private labels?: gmail_v1.Schema$Label[]
    private num = 0

    constructor(auth: OAuth2Client) {
        this.gmail = new gmail_v1.Gmail({ auth })
    }

    async parse(message: gmail_v1.Schema$Message) {
        if (!message.id) {
            throw new Error(`message invalid`)
        }
        this.ids.push(message.id)
        if (this.ids.length >= MAX_IDS_CHUNK) {
            return this.archive()
        }
    }

    async end() {
        if (this.ids.length > 0) {
            await this.archive()
        }
        console.log(`${this.num} messages succesfully archived`)
    }

    private async labelId(name: string) {
        if (!this.labels) {
            const res = await this.gmail.users.labels.list({ userId: "me" })
            this.labels = res.data.labels
            if (!this.labels) {
                throw new Error("labels not found")
            }
        }
        const label = this.labels.find(item => item.name === name)
        if (!label || !label.id) {
            throw new Error(`label: ${name} not found`)
        }
        return label.id
    }

    private async archive() {
        await this.gmail.users.messages.batchModify({
            requestBody: {
                ids: this.ids,
                removeLabelIds: [await this.labelId("INBOX")],
            },
            userId: "me",
        })
        this.num += this.ids.length
        this.ids = []
    }
}

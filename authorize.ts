import { readFile, writeFile } from "fs"
import { OAuth2Client } from "google-auth-library"
import { oauth2_v2 } from "googleapis"
import { createInterface } from "readline"
import { promisify } from "util"

const read = promisify(readFile)
const write = promisify(writeFile)
const CREDENTIAL_JSON = "client_id.json"
const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]
const TOKEN_PATH = "token.json"

interface CredentialJSON {
    installed: {
        auth_provider_x509_cert_url: string
        auth_uri: string
        client_id: string
        client_secret: string
        project_id: string
        redirect_uris: string[]
        token_uri: string
    }
}

const readCredential = async () => {
    const credentialTxt = await read(CREDENTIAL_JSON, { encoding: "utf-8" })
    return JSON.parse(credentialTxt) as CredentialJSON
}

const getNewToken = (client: OAuth2Client) => async () => {
    const authUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    })
    console.log("Authorize this app by visiting this url:", authUrl)
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    const code = await new Promise<string>(resolve => {
        rl.question("Enter the code from that page here: ", resolve)
    })
    rl.close()
    const token = await client.getToken(code)
    const tokenTxt = JSON.stringify(token.tokens)
    await write(TOKEN_PATH, tokenTxt)
    console.log("Token stored to", TOKEN_PATH)
    return tokenTxt
}

export const authorize = async () => {
    const credentialJSON = await readCredential()
    const { client_secret, client_id, redirect_uris } = credentialJSON.installed
    const client = new OAuth2Client(client_id, client_secret, redirect_uris[0])
    const token = await read(TOKEN_PATH, { encoding: "utf-8" }).catch(
        getNewToken(client),
    )
    client.setCredentials(JSON.parse(token))
    return client
}

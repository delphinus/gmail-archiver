import { readFileSync } from "fs"

const CREDENTIAL_JSON = "client_id.json"

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

export const readCredential = () => {
    const credentialTxt = readFileSync(CREDENTIAL_JSON, { encoding: "utf-8" })
    return JSON.parse(credentialTxt) as CredentialJSON
}

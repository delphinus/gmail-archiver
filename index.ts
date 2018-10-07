import { gmail_v1 } from "googleapis"
import { readCredential } from "./credential"

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
const TOKEN_PATH = "token.json"
const credential = readCredential()

const gmail = new gmail_v1.Gmail({})

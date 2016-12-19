export class Message {
    public subject: string
    public from: string
    public snippet: string
    public date: Date
    public body: string

    constructor (subject: string, from: string, snippet: string, date: Date, body: string) {
        this.subject = subject
        this.from = from
        this.snippet = snippet
        this.date = date
        this.body = body
    }
}
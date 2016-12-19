import { utf8Decode } from '../../helpers'
import { Message } from './message.model'

declare var gapi: any

export class GmailService {
    public $inject: string[] = [ '$q', '$sce' ]

    private nextPageToken: string = ''
    private $q
    private $sce

    constructor ($q, $sce) {
        this.$q = $q
        this.$sce = $sce
    }

    public initClient () {
        return gapi.client.load('gmail', 'v1')
    }

    public getMsgList () {
        let deferred = this.$q.defer()
        let messages: Message[] = []

        let request = gapi.client.gmail.users.messages.list({
            labelIds: [ 'INBOX' ],
            maxResults: 10,
            pageToken: this.nextPageToken,
            userId: 'me',
        })

        request.execute((resp) => {
            let batch = gapi.client.newBatch()

            this.nextPageToken = resp.nextPageToken

            resp.messages.forEach((row) => {
                batch.add(gapi.client.gmail.users.messages.get({
                    id: row.id,
                    userId: 'me',
                }))
            })

            batch.then((response) => {
                for (let prop in response.result) {
                    if (response.result[prop] !== undefined) {
                        let subject: any = response.result[prop].result.payload.headers.filter((row) => row.name === 'Subject')
                        let from: any = response.result[prop].result.payload.headers.filter((row) => row.name === 'From')
                        let snippet: string = response.result[prop].result.snippet
                        let date: Date = new Date(parseInt(response.result[prop].result.internalDate, 10))

                        let body: string = this.extractBody(response.result[prop].result.payload)

                        messages.push(new Message(subject.length ? subject[0].value : '', from.length ? from[0].value : '', snippet, date, body))
                    }
                }

                deferred.resolve(messages)
            })

            batch.execute()
        })

        return deferred.promise
    }

    private extractBody (payload: any): string {
        let body: string = ''

        if (payload.parts !== undefined) {
            let part = payload.parts.filter((row) => row.mimeType === 'text/html')

            return this.extractBody(part.length ? part[0] : payload.parts[0])
        } else if (payload.body.data !== undefined) {
            body = atob(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'))

            return this.$sce.trustAsHtml(utf8Decode(body))
        }

        return ''
    }
}

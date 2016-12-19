export class InfiniteItems {
    public numLoaded_: number = 0
    public toLoad_: number = 0
    public items: any[] = []

    public callback: any

    public getItemAtIndex (index: number) {
        if (index > this.numLoaded_) {
            this.fetchMoreItems_(index)
            return null
        }

        return this.items[index]
    }

    public getLength () {
        return this.items.length
    }

    public fetchMoreItems_ (index: number) {
        if (this.toLoad_ < index) {
            this.toLoad_ += 10

            this.callback()
                .then(() => {
                    this.numLoaded_ = this.toLoad_
                })
        }
    }
}

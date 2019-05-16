class DataSource {
    constructor(intervalMS) {
        if (!intervalMS) {
            intervalMS = 500;
        }
        let i = 0;
        this._id = setInterval(() => this.emit(i++), intervalMS);
    }

    emit(n) {
        const limit = 10;
        if (this.next) {
            this.next(n);
        }
        if (n === limit) {
            if (this.complete) {
                this.complete();
            }
            this.destroy();
        }
    }

    destroy() {
        clearInterval(this._id);
    }
}

module.exports = DataSource;

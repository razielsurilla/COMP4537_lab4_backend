class RequestTracker {
    constructor() {
        this.total_requests = 0;
    }

    new_request() {
        this.total_requests++;
    }

    get_requests() {
        return this.total_requests;
    }
}

module.exports = RequestTracker;

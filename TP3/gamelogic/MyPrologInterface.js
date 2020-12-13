const PORT = 8082;

class MyPrologInterface {
    constructor() {

    }

    async getPrologRequest(requestString) {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://0.0.0.0:' + PORT + '/' + requestString, false);

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
        if (request.status === 200)
            return request.response
        else
            throw (new Error('Error getting data'))
    }

    getInitialBoard(length) {
        let value = this.getPrologRequest("genInitBoard(" + (length + 1) + ")");
        return value;
    }
}

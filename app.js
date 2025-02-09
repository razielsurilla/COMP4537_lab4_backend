const http = require('http');
const url = require('url');
const MESSAGES = require('./lang/en/en');
const Dictionary = require('./dictionary');
const RequestTracker = require('./request_tracker');

class Server {
    constructor(port) {
        this.port = process.env.PORT || port;
        this.dictionary = new Dictionary();
        this.request_tracker = new RequestTracker();
    }

    start() {
        http.createServer((req, res) => {
            const req_url = url.parse(req.url, true);

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            if (req.method === 'OPTIONS'){
                res.writeHead(204);
                return res.end();
            }
            
            if (!req_url.pathname.startsWith('/api/definitions')) {
                // 400: incorrect api all syntax
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({message: MESSAGES.ERROR_MESSAGES.INVALID_API_CALL }));
            }

            const sub_url = req_url.pathname.replace('/api/definitions', '');
            if (sub_url && sub_url !== '/') {
                // 400: incorrect api all syntax
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({message: MESSAGES.ERROR_MESSAGES.INVALID_API_CALL }));
            }

            if (req.method === 'GET') {
                this.request_tracker.new_request();
                const { definition, error } = this.get_definition(req_url);
                if (error) {
                    // 404: not found, word is not in the dictionary.
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    let request_num = MESSAGES.USER_MESSAGES.TOTAL_NUMBER_OF_REQUESTS(this.request_tracker.get_requests());
                    let num_entries = MESSAGES.USER_MESSAGES.TOTAL_NUMBER_OF_WORDS(this.dictionary.get_num_entries());
                    return res.end(JSON.stringify({
                        message: MESSAGES.ERROR_MESSAGES.WORD_DOES_NOT_EXIST,
                        total_number_of_words: num_entries,
                        total_number_of_requests: request_num
                    }));
                }
                // 200: successful request

                res.writeHead(200, {'Content-Type': 'application/json'});
                let request_num = MESSAGES.USER_MESSAGES.TOTAL_NUMBER_OF_REQUESTS(this.request_tracker.get_requests());
                let num_entries = MESSAGES.USER_MESSAGES.TOTAL_NUMBER_OF_WORDS(this.dictionary.get_num_entries());
                return res.end(JSON.stringify({
                    definition: definition,
                    total_number_of_words: num_entries,
                    total_number_of_requests: request_num
                }));
            }

            if (req.method === 'POST') {
                this.request_tracker.new_request();
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk;
                });

                req.on('end', () => {
                    try {
                        const data = JSON.parse(body); // server expects JSON data
                        const word = data.word;
                        const definition = data.definition;
                        
                        // handle invalid input (disallow numbers)
                        if (/\d/.test(word) || /\d/.test(definition)) {
                            // 400: bad request, word or definition contains a digit.
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            return res.end(JSON.stringify({message: MESSAGES.ERROR_MESSAGES.INVALID_INPUT }));
                        }

                        const add_word_result = this.dictionary.add_definition(word, definition);
                        if (!add_word_result) {
                            // 400: bad request, word already exists
                            let num_entries = MESSAGES.USER_MESSAGES.TOTAL_NUMBER_OF_WORDS(this.dictionary.get_num_entries());
                            let request_num = MESSAGES.USER_MESSAGES.TOTAL_NUMBER_OF_REQUESTS(this.request_tracker.get_requests());
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            return res.end(JSON.stringify({
                                message: MESSAGES.ERROR_MESSAGES.WORD_ALREADY_EXISTS,
                                total_number_of_words: num_entries,
                                total_number_of_requests: request_num
                            }));
                        }
                        
                        // 201: resource created
                        res.writeHead(201, {'Content-Type': 'application/json'});
                        let num_entries = MESSAGES.USER_MESSAGES.TOTAL_NUMBER_OF_WORDS(this.dictionary.get_num_entries());
                        let request_num = MESSAGES.USER_MESSAGES.TOTAL_NUMBER_OF_REQUESTS(this.request_tracker.get_requests());
                        return res.end(JSON.stringify({
                            message: MESSAGES.SUCCESS_MESSAGE.WORD_ADDED,
                            dictionary: this.dictionary.get_all_entries(),
                            total_number_of_words: num_entries,
                            total_number_of_requests: request_num
                        }));
                    } catch (error) {
                        // 500: internal Server Error
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        return res.end(JSON.stringify({message: MESSAGES.ERROR_MESSAGES.SERVER_ERROR }));
                    }
                });
                return;
            }

            // 405: method not allowed.
            res.writeHead(405, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: MESSAGES.ERROR_MESSAGES.METHOD_NOT_ALLOWED }));

        }).listen(this.port, () => {
            console.log('Server running...');
        });
    }

    get_definition(req_url) {
        const requested_word = req_url.query.word;
        const definition = this.dictionary.get_definition(requested_word);
        return {
            definition: definition,
            error: definition === null,
        };
    }
}

const server = new Server(8000);
server.start();

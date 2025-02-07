const http = require('http');
const url = require('url');

const MESSAGES = require('./lang/en/en');
const Dictionary = require('./dictionary');

class Server {
    constructor(port) {
        this.port = port;
        this.dictionary = new Dictionary();
    }

    start() {
        http.createServer((req, res) => {
            const req_url = url.parse(req.url, true);

            if (!req_url.pathname.startsWith('/api/definitions')) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(MESSAGES.ERROR_MESSAGES.INVALID_API_CALL);
                return;
            }

            const sub_url = req_url.pathname.replace('/api/definitions', '');
            if (sub_url && sub_url !== '/') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write(MESSAGES.ERROR_MESSAGES.INVALID_API_CALL);
                res.end();
                return;
            }

            if (req.method === 'GET') {
                const { definition, error } = this.get_definition(req_url);
                if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end(MESSAGES.ERROR_MESSAGES.WORD_DOES_NOT_EXIST);
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(definition);
                return;
            }

            if (req.method === 'POST') {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk;
                });

                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        const word = data.word;
                        const definition = data.definition;

                        const add_word_result = this.dictionary.add_definition(word, definition);
                        if (!add_word_result) {
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end(MESSAGES.ERROR_MESSAGES.WORD_ALREADY_EXISTS);
                            return;
                        }

                        res.writeHead(201, { 'Content-Type': 'text/plain' });
                        res.end(`${word}: ${definition}`);
                    } catch (error) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end(MESSAGES.ERROR_MESSAGES.INVALID_REQUEST);
                    }
                });
                return;
            }

            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end(MESSAGES.ERROR_MESSAGES.METHOD_NOT_ALLOWED);

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

module.exports = Server;

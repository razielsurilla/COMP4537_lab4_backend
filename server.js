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
        http.createServer(async (req, res) => {
            const req_url = url.parse(req.url, true);

            if (!req_url.pathname.startsWith('/api/definitions/')) {
                // improper api call
                // handle_not_found();
                return;
            }

            const sub_url = req_url.pathname.replace('/api/definitions/', '');
            if (sub_url !== '' && sub_url !== '/') {
                // improper api call
                // handle_not_found();
                return;
            }

            if (req.method === 'GET') {
                const { definition, error } = this.get_definition(req_url);

                if (error) {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.write(MESSAGES.ERROR_MESSAGES.WORD_DOES_NOT_EXIST);
                    return;
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(definition);
                return;
            }
            if (req.method === 'POST') {
                const result = this.add_new_word(req, res);
            }
            // invalid api method
            // handle_not_found();

        }).listen(8000, () => {
            console.log('Server running...');
        });
    }

    get_definition(req_url) {
        const requested_word = req_url.query.word;
        const definition = this.dictionary.get_definition(requested_word);
        return {
            definition: definition,
            error: definition === null
        };
    }

    add_new_word(req, res) {
        
    }
}

module.exports = Server;
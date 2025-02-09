const ERROR_MESSAGES = {
    INVALID_API_CALL: 'Invalid API call',
    WORD_DOES_NOT_EXIST: 'Word % not found.',
    WORD_ALREADY_EXISTS: 'Word % already exists.',
    METHOD_NOT_ALLOWED: 'Invalid API method.',
    SERVER_ERROR: 'There\'s something wrong with the server. Sorry.',
    INVALID_INPUT: 'Accept only non-empty strings (disallow numbers).',
    EMPTY_INPUT : 'Word and definition cannot be empty.',
};
const USER_MESSAGES = {
    TOTAL_NUMBER_OF_REQUESTS: (request_num) => `Request #${request_num}`,
    TOTAL_NUMBER_OF_WORDS: (total_words) => 
        total_words === 1 
            ? `There is ${total_words} word in the dictionary.` 
            : `There are ${total_words} words in the dictionary.`
};

const SUCCESS_MESSAGE = {
    WORD_ADDED: 'Word % added successfully!',
};


module.exports = { ERROR_MESSAGES, USER_MESSAGES, SUCCESS_MESSAGE };

const ERROR_MESSAGES = {
    INVALID_API_CALL: 'Invalid API call',
    WORD_DOES_NOT_EXIST: 'Word not found.',
    WORD_ALREADY_EXISTS: 'Word already exists.',
    METHOD_NOT_ALLOWED: 'Invalid API method.',
};
const USER_MESSAGES = {
    TOTAL_NUMBER_OF_REQUEST: (request_num) => `Request #${request_num}`,
    TOTAL_NUMER_OF_WORDS: (total_words) => `There are ${total_words} words in the dictionary.`,
};

module.exports = { ERROR_MESSAGES, USER_MESSAGES };

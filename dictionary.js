class Dictionary {
    constructor() {
        this.dictionary = {};
    }

    add_definition(word, definition) {
        if (this.dictionary[word]) {
            // word already exists.
            return false;
        }
        this.dictionary[word] = definition;
        return true;
    }

    get_definition(word) {
        return this.dictionary[word] || null;
    }

    has_word(word) {
        return word in this.dictionary;
    }

    delete_word(word) {
        if (this.has_word(word)) {
            delete this.dictionary[word];
            return true;
        }
        return false;
    }
}

module.exports = Dictionary;
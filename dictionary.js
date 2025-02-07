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

    get_num_entries() {
        return Object.keys(this.dictionary).length;
    }
}

module.exports = Dictionary;

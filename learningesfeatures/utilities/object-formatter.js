const DELIMITER = ', ';
const NO_OF_TRAIL_CHARS = 2;
const START_POS=0;
const INVALID_ARGUMENTS = 'Invalid Argument(s) Specified!';

class ObjectFormatter {
    static format(obj) {
        if(!obj) {
            throw new Error(INVALID_ARGUMENTS);
        }

        let formattedMessage = '';

        for(let propertyIndex in obj) {
            let property = obj[propertyIndex];
            let validtaion = property && typeof property !== 'function';
            
            if(validtaion) {
                formattedMessage += `${property}${DELIMITER}`;
            }
        }

        formattedMessage = formattedMessage.substr(
            START_POS, formattedMessage.length - NO_OF_TRAIL_CHARS);

        return formattedMessage;
    }
}

export {
    ObjectFormatter
};

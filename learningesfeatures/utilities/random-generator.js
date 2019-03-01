const DEFAULT_MINIMUM = 1; 
const DEFAULT_MAXIMUM= 1000000;

class RandomGenerator {
    static generate(minimum = DEFAULT_MINIMUM, maximum = DEFAULT_MAXIMUM) {
        let randomNumber = Math.floor(
            Math.random() * (maximum - minimum) + minimum);
        
        return randomNumber;
    }
}

export {
    RandomGenerator
};

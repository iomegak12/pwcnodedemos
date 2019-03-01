import Mongoose from 'mongoose';
import { ConfigurationManager } from '../config';
import { CustomerSchema } from '../schemas';

class DbManager{
    constructor() {
        this.connection = Mongoose;
        this.connection.Promise = Promise;
        this.customersModel= this.connection.model('customers', Mongoose.Schema(CustomerSchema));
    }
}

export {
    DbManager
};

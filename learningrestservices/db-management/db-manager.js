import Mongoose from 'mongoose';
import { ConfigurationManager } from '../config';
import { CustomerSchema } from '../schemas';

class DbManagerEx {
    constructor() {
        this.connection = Mongoose;
        this.connection.Promise = Promise;
        this.customersModel= this.connection.model('customers', Mongoose.Schema(CustomerSchema));
    }
}

export const DbManager = new DbManagerEx();

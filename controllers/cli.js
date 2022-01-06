const mongoose = require('mongoose');
const { URI } = require("../config");

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to db
const db = mongoose.connect(URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Import model
const Customer = require('../models/customer');

// Add Customer
const addCustomer = async (customer) => {
    const newCustomer = await new Customer(customer)
    newCustomer.save(err => {
        if (err) {
            console.log('err', err);
        } else {
            mongoose.connection.close();
            console.info('New Customer Added');
        }
    });
}

// Find Customer
const findCustomer = (name) => {
  // Make case insensitive
  const search = new RegExp(name, 'i');
  Customer.find({$or: [{firstname: search}, {lastname: search}]})
    .then(customer => {
      console.info(customer);
      console.info(`${customer.length} matches`);
      mongoose.connection.close();
    });
}

// Update Customer
const updateCustomer = (_id, customer) => {
  Customer.update({ _id }, customer)
    .then(customer => {
      console.info('Customer Updated');
      mongoose.connection.close();
    });
}

// Remove Customer
const removeCustomer = (_id) => {
  Customer.remove({ _id })
    .then(customer => {
      console.info('Customer Removed');
      mongoose.connection.close();
    });
}

// List Customers
const listCustomers = () => {
  Customer.find()
    .then(customers => {
      console.info(customers);
      console.info(`${customers.length} customers`);
      mongoose.connection.close();
    });
}

// Export All Methods
module.exports = {
  addCustomer,
  findCustomer,
  updateCustomer,
  removeCustomer,
  listCustomers
}

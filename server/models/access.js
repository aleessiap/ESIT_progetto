const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Access schema
const accessSchema = new Schema(

  {

    user_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    door_id: { type: mongoose.SchemaTypes.ObjectId, required: true }

  },
  {

    timestamps: true

  }

);

module.exports = mongoose.model('Access', accessSchema, 'Access');

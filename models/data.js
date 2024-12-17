const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Basic schema for data storage
const DataSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the user
    event: String,                                       // Type of event
    data: String,                                        // Raw data string
    avgBPM: Number,                                      // Average heart rate
    spO2: Number,                                        // Blood oxygen saturation level
    coreId: String,                                      // Device core ID
    publishedAt: Date,                                   // Timestamp of data publication
    firmwareVersion: String                              // Firmware version of the device
});

// Create the model
const Data = mongoose.model('Data', DataSchema);

module.exports = Data;

const { default: mongoose } = require("mongoose");

const accountSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    time: Date,
    type: {
        type: Number,
        default: -1
    },
    account: {
        type: Number,
        required: true
    },
    remarks: String
})

const accountModule = mongoose.model('accounts', accountSchema)

module.exports = accountModule
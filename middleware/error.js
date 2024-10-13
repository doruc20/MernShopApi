const logger = require("../middleware/logger");

module.exports = function(err, req , res , next){

    logger.error(err.message)
    res.status(500).send(err.message);

};
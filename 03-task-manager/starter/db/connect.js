const mongoose = require('mongoose');

const connectionString = "mongodb+srv://ksl_23:ksl_23@nodeexpressjs.ixa8u5s.mongodb.net/03-TASK-MANAGER?retryWrites=true&w=majority"

mongoose.connect(connectionString)
.then(() => console.log('CONNECTED TO THE DB'))
.catch((e) => console.log(e));


const compression = require('compression');
const express = require('express');
const fs = require('fs');

const app = express(),
    staticServe = express.static('public/', {
        etag: false
    });

app.use(compression());
app.use("/", staticServe);
app.use("*", staticServe);

app.listen(3000, () => console.log('App is running on port 3000...'));
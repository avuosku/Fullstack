const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());

morgan.token("post-data", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));
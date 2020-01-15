const express = require("express");

const postsRouter = require("../Routes/posts-router");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.send("<h2>Routing with Mike</h2>");
});

server.use("/api/posts", postsRouter);

module.exports = server;
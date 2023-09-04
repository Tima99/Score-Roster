require("./db");
const express = require("express");
const limiter = require("express-rate-limit")
const { PORT }= require("./config");
const entryRoutes        = require("./routes/entryRoutes");
const { entryRateLimit } = require("./config/rateLimits")

const app = express();

// Middlewares
app.use(express.json());
app.use("/api", limiter(entryRateLimit), entryRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, (_) => console.log(`Server is running on port ${PORT}`));

// Routes
app.get("/", (_, res) => res.send("Welcome Hero, Your site is live 😍😍!"));

// wrap all handlers with try / catch block
function asyncErrorsWraper(handler) {
    return (req, res, next) => {
        // Wrap the async route handler with a try-catch block
        Promise.resolve(handler(req, res, next)).catch(next);
    };
}

entryRoutes.stack.forEach(layer => {
    if (layer.route) {
        layer.route.stack.forEach((routeHandler) => {
            routeHandler.handle = asyncErrorsWraper(routeHandler.handle);
        });
    }
});

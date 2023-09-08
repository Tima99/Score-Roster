require("./db");
const express       = require("express");
const limiter       = require("express-rate-limit")
const cookieParser  = require("cookie-parser")

const { PORT }          = require("./config");
const entryRoutes       = require("./routes/entryRoutes");
const playerRoutes      = require("./routes/playerRoutes");
const teamRoutes        = require("./routes/teamRoutes");
const { entryRateLimit }= require("./config/rateLimits")

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use("/api", playerRoutes);

app.use("/api", limiter(entryRateLimit), entryRoutes);
app.use("/api", teamRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, (_) => console.log(`Server is running on port ${PORT}`));

// Routes
app.get("/", (_, res) => res.send("Welcome Buddy, Your site is live 😍😍!"));

// wrap all handlers with try / catch block
function asyncErrorsWraper(handler) {
    return (req, res, next) => {
        // Wrap the async route handler with a try-catch block
        Promise.resolve(handler(req, res, next)).catch(next);
    };
}

const routes = [...entryRoutes.stack, ...playerRoutes.stack, ...teamRoutes.stack]
routes.forEach(layer => {
    if (layer.route) {
        layer.route.stack.forEach((routeHandler) => {
            routeHandler.handle = asyncErrorsWraper(routeHandler.handle);
        });
    }
});

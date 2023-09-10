require("./db");
const express       = require("express");
const limiter       = require("express-rate-limit")
const cookieParser  = require("cookie-parser")

const { PORT }          = require("./config");
const entryRoutes       = require("./routes/entryRoutes");
const playerRoutes      = require("./routes/playerRoutes");
const teamRoutes        = require("./routes/teamRoutes");
const matchRoutes       = require("./routes/matchRoutes");
const statsRoutes       = require("./routes/statsRoutes");
const protectedRoutes   = require('./routes/protectedRoutes')
const { entryRateLimit , globalRateLimit }= require("./config/rateLimits")
const {
    verifyAccessToken, 
    verifyTeamAdmin, 
    isAdminOrCaptain
} = require("./middlewares")

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use(limiter(globalRateLimit))
app.use("/api", playerRoutes);
app.use("/api", teamRoutes);
app.use("/api", matchRoutes);
app.use("/api", statsRoutes);

app.use(limiter(entryRateLimit))
app.use("/api", entryRoutes);

// protected routes
app.use(verifyAccessToken)
app.use('/api', protectedRoutes.verifiedUsers)

app.use(isAdminOrCaptain)
app.use('/api', protectedRoutes.adminOrCaptain)

app.use(verifyTeamAdmin)
app.use('/api', protectedRoutes.teamAdmin)

app.use((err, req, res, next) => {
    const errBoundary = '='.repeat(25)
    console.error(`${errBoundary}\n${err.stack}\n${errBoundary}`);
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

const { verifiedUsers, teamAdmin, adminOrCaptain } = protectedRoutes
const routes = [
    ...entryRoutes.stack,
    ...playerRoutes.stack, 
    ...teamRoutes.stack, 
    ...matchRoutes.stack,
    ...verifiedUsers.stack, 
    ...teamAdmin.stack, 
    ...adminOrCaptain.stack,
    ...statsRoutes.stack
]
routes.forEach(layer => {
    if (layer.route) {
        layer.route.stack.forEach((routeHandler) => {
            routeHandler.handle = asyncErrorsWraper(routeHandler.handle);
        });
    }
});

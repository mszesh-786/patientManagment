import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const APP_ORIGIN = process.env.APP_ORIGIN || "http://localhost:5173";
const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN || "";
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || "";
const COGNITO_REDIRECT_URI = process.env.COGNITO_REDIRECT_URI || "";
const COOKIE_NAME = process.env.COOKIE_NAME || "app_session";
const DEFAULT_IDP = process.env.COGNITO_IDENTITY_PROVIDER || "";

type AuthState = {
    nonce: string;
    codeVerifier: string;
    returnTo: string;
    createdAt: number;
}
const authStateStore = new Map<string, AuthState>();

type Session = {
    user: any;
    createdAt: number;
    lastActiveAt: number;
}
const sessionStore = new Map<string, Session>();
function base64url(input: Buffer): string {
    return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sha256(input: string) {
    const hash = crypto.createHash('sha256').update(input).digest();
    return base64url(hash);
}
function isSafeReturnTo(url: string) {
  return url.startsWith("/") && !url.startsWith("//") && !url.includes("http");
}

function cookieOptions() {
  const isLocal = APP_ORIGIN.startsWith("http://localhost");
  const isCrossSite = !isLocal && !APP_ORIGIN.includes("your-domain.com"); // adjust
  return {
    httpOnly: true,
    secure: !isLocal,
    sameSite: isCrossSite ? "none" : "lax",
    path: "/",
  };
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", APP_ORIGIN);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token");
    if(req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

app.post("/auth/discover", async (req, res) => {
    const email = String(req.body.email || "").toLowerCase().trim();
    if(!email.includes("@")) return res.status(400).json({ error: "Invalid email" });
    return res.json({
        mode: "SSO_AND_NATIVE",
        allowRegister: true,
        idps: [
            {
                key: "default", displayName: DEFAULT_IDP || "SSO Provider", type: "OIDC"},
            
        ],
        defaultIdpKey: "default"
    });
    })
app.post("/auth/start", async (req, res) => {
    const returnToRaw = String(req.query.returnTo || "/");
    const returnTo = isSafeReturnTo(returnToRaw) ? returnToRaw : "/";
    const idpKey = String(req.body.idpKey || "default");

    const state =crypto.randomBytes(32).toString("hex");
    const nonce = crypto.randomBytes(32).toString("hex");
    const codeVerifier = base64url(crypto.randomBytes(32));
    const codeChallenge = sha256(codeVerifier);
    authStateStore.set(state, { nonce, codeVerifier, returnTo, createdAt: Date.now() });
    const params = new URLSearchParams({
        client_id: COGNITO_CLIENT_ID,
        response_type: "code",
        scope: "openid profile email",
        redirect_uri: COGNITO_REDIRECT_URI,
        state,
        nonce,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
    });
   if (idpKey === "default" && DEFAULT_IDP) {
  params.set("identity_provider", DEFAULT_IDP);
}
    const authorizationUrl = `https://${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
    return res.redirect(authorizationUrl);
    });

    app.get("/auth/callback", async (req, res) => {
        const code= String(req.query.code || "");
        const state = String(req.query.state || "");
        if(!code || !state) return res.status(400).json({ error: "Missing code or state" });
        const saved= authStateStore.get(state);
        if(!saved) return res.status(400).json({ error: "Invalid state" });
        authStateStore.delete(state);

        const tokenParams = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: COGNITO_CLIENT_ID,
            code,
            redirect_uri: COGNITO_REDIRECT_URI,
            code_verifier: saved.codeVerifier,
        });
        const tokenRes= await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tokenParams.toString(),
        });
        if (!tokenRes.ok) {
            const txt= await tokenRes.text();
            return res.status(500).json({ error: "Failed to fetch token", details: txt });
        }
        const tokens: any = await tokenRes.json();

        const sessionId = crypto.randomBytes(32).toString("hex");
        sessionStore.set(sessionId, {
            user: {
                id_token: tokens.id_token,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
            createdAt: Date.now(),
            lastActiveAt: Date.now()
        });
        res.cookie(COOKIE_NAME,sessionId,cookieOptions());
        return res.redirect(`${APP_ORIGIN}${saved.returnTo}`);
        });
        app.get("/me", async (req, res) => {
            const sessionId = req.cookies[COOKIE_NAME];
            if(!sessionId) return res.status(401).json({ error: "Not authenticated" });
            const session = sessionStore.get(sessionId);
            if(!session) return res.status(401).json({ error: "Not authenticated" });
            session.lastActiveAt = Date.now();
            return res.json({
                authenticated: true,
                sessionCreatedAt: session.createdAt,
                user: session.user,
            });
        });

        app.post("/auth/logout", async (req, res) => {
            const sessionId = req.cookies[COOKIE_NAME];
            if(sessionId) sessionStore.delete(sessionId);
            res.clearCookie(COOKIE_NAME, cookieOptions());
            return res.json({ success: true });
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Cognito authroize: https://${COGNITO_DOMAIN}/oauth2/authorize`);
        });
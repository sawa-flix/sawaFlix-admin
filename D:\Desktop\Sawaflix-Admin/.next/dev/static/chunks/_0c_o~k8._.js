(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/utils/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
let client = null;
function createClient() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Browser context — singleton to prevent token refresh race conditions.
    // No cookies option: let @supabase/ssr use document.cookie automatically.
    if (!client) {
        client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://xjxbjnjspmmpfngbdihd.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqeGJqbmpzcG1tcGZuZ2JkaWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTc4MTYsImV4cCI6MjA3MDY5MzgxNn0.ypBgjbNyptFwP_tsETjGTwCWzacfq62l9YyCH1P-gKw"));
    }
    return client;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/services/authService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TwoFAError",
    ()=>TwoFAError,
    "check2FAStatus",
    ()=>check2FAStatus,
    "resendAdminOtp",
    ()=>resendAdminOtp,
    "signOutAdmin",
    ()=>signOutAdmin,
    "startAdminLogin",
    ()=>startAdminLogin,
    "verifyAdminOtp",
    ()=>verifyAdminOtp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/supabase/client.ts [app-client] (ecmascript)");
;
const ADMIN_API_URL = (("TURBOPACK compile-time value", "https://adminapi.sawaflix.com") || 'https://adminapi.sawaflix.com').replace(/\/$/, '');
class TwoFAError extends Error {
    code;
    attemptsRemaining;
    constructor(code, message, attemptsRemaining){
        super(message), this.code = code, this.attemptsRemaining = attemptsRemaining;
        this.name = 'TwoFAError';
    }
}
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
async function startAdminLogin(email, password) {
    const response = await fetch(`${ADMIN_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const body = await response.json().catch(()=>null);
    if (!response.ok) {
        const errBody = isRecord(body) ? body : {};
        const message = typeof errBody.error === 'string' ? errBody.error : `Authentication request failed (${response.status}).`;
        const code = response.status === 401 ? 'INVALID_CREDENTIALS' : response.status === 403 ? 'FORBIDDEN' : response.status === 423 ? 'ACCOUNT_LOCKED' : response.status === 429 ? 'RATE_LIMITED' : 'UNKNOWN';
        throw new TwoFAError(code, message);
    }
    // Extract JWT from response body
    const token = isRecord(body) && typeof body.token === 'string' ? body.token : '';
    if (!token) {
        throw new TwoFAError('AUTHENTICATION_FAILED', 'No token received from server.');
    }
    // Set the Supabase session so middleware + protected routes recognise the user
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const { error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token
    });
    if (sessionError) {
        console.warn('[authService] setSession warning:', sessionError.message);
        // Fallback: store token directly so API calls can use it
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('adminToken', token);
        }
    }
    // Return a resolved challenge with requiresTwoFactor=false so the login
    // page skips the OTP screen and goes straight to redirectToAdmin()
    return {
        success: true,
        requiresTwoFactor: false,
        challengeId: 'DIRECT_LOGIN',
        expiresInSeconds: 3600,
        deliveryAddress: email
    };
}
async function verifyAdminOtp(_challengeId, _code) {
// No-op: admin backend uses direct JWT, no OTP step
}
async function resendAdminOtp(_challengeId) {
    throw new TwoFAError('UNKNOWN', 'OTP is not supported on the admin backend.');
}
async function check2FAStatus() {
    return {
        success: true,
        isVerified: true
    };
}
async function signOutAdmin() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.removeItem('adminToken');
    }
    await supabase.auth.signOut();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utils/errorMessages.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "get2FAFriendlyError",
    ()=>get2FAFriendlyError,
    "getFriendlyError",
    ()=>getFriendlyError
]);
/**
 * Maps raw technical error messages to user-friendly messages.
 * Used across all admin components to avoid exposing internal details to users.
 */ const ERROR_MAP = [
    // Supabase / Auth errors
    {
        pattern: /invalid api key/i,
        message: "Unable to connect to the server. Please contact support."
    },
    {
        pattern: /invalid login credentials/i,
        message: "Incorrect email or password. Please try again."
    },
    {
        pattern: /email not confirmed/i,
        message: "Your email has not been verified. Please check your inbox."
    },
    {
        pattern: /user not found/i,
        message: "No account found with this email address."
    },
    {
        pattern: /signup is disabled/i,
        message: "Account registration is currently disabled."
    },
    {
        pattern: /rate limit/i,
        message: "Too many attempts. Please wait a moment and try again."
    },
    {
        pattern: /jwt expired/i,
        message: "Your session has expired. Please sign in again."
    },
    {
        pattern: /refresh_token_not_found/i,
        message: "Your session has expired. Please sign in again."
    },
    {
        pattern: /invalid claim|invalid token/i,
        message: "Authentication error. Please sign in again."
    },
    // Network / Fetch errors
    {
        pattern: /failed to fetch|network/i,
        message: "Network error. Please check your internet connection and try again."
    },
    {
        pattern: /timeout|timed out/i,
        message: "The request timed out. Please try again."
    },
    {
        pattern: /cors|cross-origin/i,
        message: "Connection blocked. Please contact support."
    },
    // HTTP status errors
    {
        pattern: /401|unauthorized/i,
        message: "You are not authorized. Please sign in again."
    },
    {
        pattern: /403|forbidden/i,
        message: "You do not have permission to perform this action."
    },
    {
        pattern: /404|not found/i,
        message: "The requested resource was not found."
    },
    {
        pattern: /500|internal server/i,
        message: "Something went wrong on our end. Please try again later."
    },
    {
        pattern: /502|bad gateway/i,
        message: "The server is temporarily unavailable. Please try again later."
    },
    {
        pattern: /503|service unavailable/i,
        message: "The service is temporarily down for maintenance. Please try again later."
    },
    // Admin-specific
    {
        pattern: /access denied.*admin/i,
        message: "Access denied. Admin privileges are required to access this portal."
    },
    // 2FA-specific (pattern-matched on error code strings embedded in messages)
    {
        pattern: /ACCOUNT_LOCKED/,
        message: "Your account has been locked after too many incorrect attempts. Please wait 15 minutes and try again."
    },
    {
        pattern: /OTP_EXPIRED/,
        message: "Your verification code has expired. Please request a new one."
    },
    {
        pattern: /INVALID_OTP/,
        message: "Incorrect verification code. Please check the code and try again."
    },
    {
        pattern: /RATE_LIMITED|429|too many.*code/i,
        message: "Too many code requests. Please wait a moment before requesting a new code."
    },
    {
        pattern: /2FA_REQUIRED/,
        message: "Two-factor verification is required. Please complete the security check."
    }
];
function getFriendlyError(rawError) {
    const message = rawError instanceof Error ? rawError.message : String(rawError || '');
    for (const { pattern, message: friendly } of ERROR_MAP){
        if (pattern.test(message)) {
            return friendly;
        }
    }
    // Fallback: if the message looks technical (contains code-like terms), hide it
    if (/key|token|jwt|api|null|undefined|supabase|postgres|sql/i.test(message)) {
        return "Something went wrong. Please try again or contact support.";
    }
    // If it's already somewhat readable, return it as-is
    return message || "An unexpected error occurred. Please try again.";
}
function get2FAFriendlyError(err) {
    const base = getFriendlyError(err.code); // reuse existing pattern map
    if (err.code === 'INVALID_OTP' && typeof err.attemptsRemaining === 'number') {
        return `${base} ${err.attemptsRemaining} attempt${err.attemptsRemaining === 1 ? '' : 's'} remaining.`;
    }
    return base;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Auth/OtpChallenge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OtpChallenge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * OtpChallenge.tsx
 *
 * A fully self-contained 2FA OTP challenge UI component.
 *
 * Props:
 *   onSuccess   — called when backend confirms isVerified: true
 *   onCancel    — called when the user explicitly goes back to the login form
 *   deliveryAddress — masked destination returned by the backend
 *
 * Internal states:
 *   idle          — initial, waiting for user to type
 *   submitting    — verify request in flight
 *   wrong_code    — INVALID_OTP; shows attemptsRemaining
 *   expired       — OTP_EXPIRED; resend button enabled
 *   locked        — ACCOUNT_LOCKED; all input disabled, countdown/message shown
 *   rate_limited  — 429 on send; brief cooldown message
 *   resending     — send request in flight
 *
 * Countdown:
 *   5-minute window exactly matching backend OTP TTL.
 *   Resend is disabled while the countdown is active AND a live code exists.
 *   After expiry the code clears and resend becomes available.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/authService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/errorMessages.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const DIGIT_COUNT = 6;
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatCountdown(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}
function OtpChallenge({ onSuccess, onCancel, challengeId, deliveryAddress, expiresInSeconds }) {
    _s();
    // ----- digit inputs -----
    const [digits, setDigits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Array(DIGIT_COUNT).fill(''));
    const inputRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(Array(DIGIT_COUNT).fill(null));
    // ----- UI state -----
    const [challengeState, setChallengeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [statusMessage, setStatusMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [attemptsLeft, setAttemptsLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ----- countdown -----
    const [countdown, setCountdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(expiresInSeconds);
    const [countdownActive, setCountdownActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ----- derived -----
    const code = digits.join('');
    const isComplete = code.length === DIGIT_COUNT;
    const isInputDisabled = challengeState === 'submitting' || challengeState === 'locked' || challengeState === 'resending' || challengeState === 'success';
    const isResendDisabled = challengeState === 'submitting' || challengeState === 'resending' || challengeState === 'locked' || challengeState === 'success' || countdownActive && challengeState !== 'expired';
    // ---------------------------------------------------------------------------
    // Countdown timer management
    // ---------------------------------------------------------------------------
    const startCountdown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OtpChallenge.useCallback[startCountdown]": (seconds = expiresInSeconds)=>{
            if (timerRef.current) clearInterval(timerRef.current);
            setCountdown(seconds);
            setCountdownActive(true);
            timerRef.current = setInterval({
                "OtpChallenge.useCallback[startCountdown]": ()=>{
                    setCountdown({
                        "OtpChallenge.useCallback[startCountdown]": (prev)=>{
                            if (prev <= 1) {
                                clearInterval(timerRef.current);
                                setCountdownActive(false);
                                // Only switch to expired if we haven't already locked out
                                setChallengeState({
                                    "OtpChallenge.useCallback[startCountdown]": (s)=>s !== 'locked' ? 'expired' : s
                                }["OtpChallenge.useCallback[startCountdown]"]);
                                setStatusMessage('Your verification code has expired. Please request a new one.');
                                return 0;
                            }
                            return prev - 1;
                        }
                    }["OtpChallenge.useCallback[startCountdown]"]);
                }
            }["OtpChallenge.useCallback[startCountdown]"], 1000);
        }
    }["OtpChallenge.useCallback[startCountdown]"], [
        expiresInSeconds
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OtpChallenge.useEffect": ()=>{
            startCountdown(expiresInSeconds);
            return ({
                "OtpChallenge.useEffect": ()=>{
                    if (timerRef.current) clearInterval(timerRef.current);
                }
            })["OtpChallenge.useEffect"];
        }
    }["OtpChallenge.useEffect"], [
        expiresInSeconds,
        startCountdown
    ]);
    // ---------------------------------------------------------------------------
    // Digit input handlers
    // ---------------------------------------------------------------------------
    const handleDigitChange = (index, value)=>{
        if (isInputDisabled) return;
        // Accept only digits
        const digit = value.replace(/\D/g, '').slice(-1);
        const next = [
            ...digits
        ];
        next[index] = digit;
        setDigits(next);
        // Clear any previous error state when typing
        if (challengeState === 'wrong_code' || challengeState === 'expired') {
            setChallengeState('idle');
            setStatusMessage('');
        }
        // Auto-advance to next field
        if (digit && index < DIGIT_COUNT - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        // Auto-submit when last digit entered
        if (digit && index === DIGIT_COUNT - 1) {
            const fullCode = [
                ...next
            ].join('');
            if (fullCode.length === DIGIT_COUNT) {
                setTimeout(()=>handleVerify(fullCode), 50);
            }
        }
    };
    const handleKeyDown = (index, e)=>{
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            // Jump back on backspace when current field is empty
            const next = [
                ...digits
            ];
            next[index - 1] = '';
            setDigits(next);
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'Enter' && isComplete && !isInputDisabled) {
            handleVerify(code);
        }
    };
    const handlePaste = (e)=>{
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, DIGIT_COUNT);
        if (!pasted) return;
        const next = Array(DIGIT_COUNT).fill('');
        pasted.split('').forEach((ch, i)=>{
            next[i] = ch;
        });
        setDigits(next);
        // Focus last filled or last
        const lastIdx = Math.min(pasted.length, DIGIT_COUNT - 1);
        inputRefs.current[lastIdx]?.focus();
        if (pasted.length === DIGIT_COUNT) {
            setTimeout(()=>handleVerify(pasted), 50);
        }
    };
    // ---------------------------------------------------------------------------
    // Verify
    // ---------------------------------------------------------------------------
    const handleVerify = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OtpChallenge.useCallback[handleVerify]": async (codeToVerify)=>{
            if (codeToVerify.length !== DIGIT_COUNT) return;
            setChallengeState('submitting');
            setStatusMessage('');
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verifyAdminOtp"])(challengeId, codeToVerify);
                setChallengeState('success');
                if (timerRef.current) clearInterval(timerRef.current);
                setTimeout(onSuccess, 400); // brief pause for success animation
            } catch (err) {
                if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TwoFAError"]) {
                    switch(err.code){
                        case 'INVALID_OTP':
                            setChallengeState('wrong_code');
                            setAttemptsLeft(typeof err.attemptsRemaining === 'number' ? err.attemptsRemaining : null);
                            setStatusMessage((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get2FAFriendlyError"])(err));
                            // Clear digits so user can re-enter
                            setDigits(Array(DIGIT_COUNT).fill(''));
                            inputRefs.current[0]?.focus();
                            break;
                        case 'OTP_EXPIRED':
                            setChallengeState('expired');
                            setCountdownActive(false);
                            if (timerRef.current) clearInterval(timerRef.current);
                            setStatusMessage((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get2FAFriendlyError"])(err));
                            setDigits(Array(DIGIT_COUNT).fill(''));
                            break;
                        case 'ACCOUNT_LOCKED':
                            setChallengeState('locked');
                            if (timerRef.current) clearInterval(timerRef.current);
                            setCountdownActive(false);
                            setStatusMessage((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get2FAFriendlyError"])(err));
                            break;
                        default:
                            setChallengeState('idle');
                            setStatusMessage((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get2FAFriendlyError"])(err));
                    }
                } else {
                    setChallengeState('idle');
                    setStatusMessage('Verification failed. Please try again.');
                }
            }
        }
    }["OtpChallenge.useCallback[handleVerify]"], [
        challengeId,
        onSuccess
    ]);
    // ---------------------------------------------------------------------------
    // Resend
    // ---------------------------------------------------------------------------
    const handleResend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OtpChallenge.useCallback[handleResend]": async ()=>{
            if (isResendDisabled) return;
            setChallengeState('resending');
            setStatusMessage('');
            setDigits(Array(DIGIT_COUNT).fill(''));
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resendAdminOtp"])(challengeId);
                setChallengeState('idle');
                setAttemptsLeft(null);
                startCountdown(result.expiresInSeconds);
                inputRefs.current[0]?.focus();
            } catch (err) {
                if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TwoFAError"]) {
                    switch(err.code){
                        case 'ACCOUNT_LOCKED':
                            setChallengeState('locked');
                            setStatusMessage((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get2FAFriendlyError"])(err));
                            break;
                        case 'RATE_LIMITED':
                            setChallengeState('rate_limited');
                            setStatusMessage((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get2FAFriendlyError"])(err));
                            // Auto-clear rate-limited state after 30 s to re-enable resend
                            setTimeout({
                                "OtpChallenge.useCallback[handleResend]": ()=>{
                                    setChallengeState({
                                        "OtpChallenge.useCallback[handleResend]": (s)=>s === 'rate_limited' ? 'idle' : s
                                    }["OtpChallenge.useCallback[handleResend]"]);
                                    setStatusMessage('');
                                }
                            }["OtpChallenge.useCallback[handleResend]"], 30_000);
                            break;
                        default:
                            setChallengeState('idle');
                            setStatusMessage((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get2FAFriendlyError"])(err));
                    }
                } else {
                    setChallengeState('idle');
                    setStatusMessage('Failed to send a new code. Please try again.');
                }
            }
        }
    }["OtpChallenge.useCallback[handleResend]"], [
        challengeId,
        isResendDisabled,
        startCountdown
    ]);
    // ---------------------------------------------------------------------------
    // Derived UI helpers
    // ---------------------------------------------------------------------------
    const isLocked = challengeState === 'locked';
    const isSuccess = challengeState === 'success';
    const isWrong = challengeState === 'wrong_code';
    const isExpired = challengeState === 'expired';
    const isRateLimited = challengeState === 'rate_limited';
    const digitBorderClass = (i)=>{
        if (isLocked) return 'border-rose-300 bg-rose-50';
        if (isSuccess) return 'border-emerald-400 bg-emerald-50';
        if (isWrong) return 'border-rose-400 bg-rose-50/50';
        if (digits[i]) return 'border-slate-700 bg-white';
        return 'border-slate-200 bg-white focus-within:border-slate-700';
    };
    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 12
        },
        animate: {
            opacity: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            y: -8
        },
        transition: {
            duration: 0.25,
            ease: 'easeOut'
        },
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: isSuccess ? {
                            scale: [
                                1,
                                1.15,
                                1
                            ]
                        } : {},
                        transition: {
                            duration: 0.4
                        },
                        className: `inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 border ${isLocked ? 'bg-rose-50 border-rose-200' : isSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`,
                        children: isLocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                            size: 24,
                            className: "text-rose-500"
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/OtpChallenge.tsx",
                            lineNumber: 354,
                            columnNumber: 13
                        }, this) : isSuccess ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                            size: 24,
                            className: "text-emerald-500"
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/OtpChallenge.tsx",
                            lineNumber: 356,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                            size: 24,
                            className: "text-slate-700"
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/OtpChallenge.tsx",
                            lineNumber: 358,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 342,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-extrabold text-slate-900 tracking-tight",
                        children: isLocked ? 'Account Locked' : isSuccess ? 'Verified!' : 'Security Check'
                    }, void 0, false, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 362,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-500 mt-1",
                        children: isLocked ? 'Too many failed attempts.' : isSuccess ? 'Redirecting to the Admin Dashboard…' : deliveryAddress ? `A 6-digit code was sent to ${deliveryAddress}` : 'Enter the 6-digit code sent to your registered email.'
                    }, void 0, false, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 365,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                lineNumber: 341,
                columnNumber: 7
            }, this),
            !isLocked && !isSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                        size: 13,
                        className: countdownActive ? 'text-slate-400' : 'text-rose-400'
                    }, void 0, false, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 379,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-xs font-semibold tabular-nums ${countdown <= 60 && countdownActive ? 'text-rose-500' : 'text-slate-500'}`,
                        children: isExpired ? 'Code expired' : `Code expires in ${formatCountdown(countdown)}`
                    }, void 0, false, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 383,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                lineNumber: 378,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "wait",
                children: statusMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        height: 0
                    },
                    animate: {
                        opacity: 1,
                        height: 'auto'
                    },
                    exit: {
                        opacity: 0,
                        height: 0
                    },
                    transition: {
                        duration: 0.2
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `p-3 rounded-xl text-xs font-medium text-center flex items-start gap-2 ${isLocked || isWrong ? 'bg-rose-50 border border-rose-200 text-rose-800' : isExpired ? 'bg-amber-50 border border-amber-200 text-amber-800' : isRateLimited ? 'bg-orange-50 border border-orange-200 text-orange-800' : 'bg-slate-50 border border-slate-200 text-slate-700'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                size: 14,
                                className: "shrink-0 mt-0.5"
                            }, void 0, false, {
                                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                                lineNumber: 414,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-left",
                                children: statusMessage
                            }, void 0, false, {
                                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                                lineNumber: 415,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 403,
                        columnNumber: 13
                    }, this)
                }, challengeState + statusMessage, false, {
                    fileName: "[project]/components/Auth/OtpChallenge.tsx",
                    lineNumber: 396,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                lineNumber: 394,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center gap-2.5",
                children: digits.map((digit, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].input, {
                        ref: (el)=>{
                            inputRefs.current[i] = el;
                        },
                        type: "text",
                        inputMode: "numeric",
                        pattern: "\\d*",
                        maxLength: 1,
                        value: digit,
                        disabled: isInputDisabled,
                        onChange: (e)=>handleDigitChange(i, e.target.value),
                        onKeyDown: (e)=>handleKeyDown(i, e),
                        onPaste: i === 0 ? handlePaste : undefined,
                        "aria-label": `Digit ${i + 1} of ${DIGIT_COUNT}`,
                        id: `otp-digit-${i}`,
                        animate: isWrong ? {
                            x: [
                                0,
                                -4,
                                4,
                                -4,
                                4,
                                0
                            ]
                        } : {},
                        transition: {
                            duration: 0.3
                        },
                        className: `
              w-11 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all
              focus:outline-none focus:ring-2 focus:ring-slate-900/15
              disabled:opacity-50 disabled:cursor-not-allowed
              ${digitBorderClass(i)}
            `
                    }, i, false, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 424,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                lineNumber: 422,
                columnNumber: 7
            }, this),
            isWrong && attemptsLeft !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center text-xs text-rose-600 font-semibold",
                children: attemptsLeft === 0 ? 'No more attempts remaining.' : `${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining before lockout.`
            }, void 0, false, {
                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                lineNumber: 452,
                columnNumber: 9
            }, this),
            !isLocked && !isSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>handleVerify(code),
                disabled: !isComplete || isInputDisabled,
                className: "w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                id: "otp-verify-btn",
                children: challengeState === 'submitting' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            size: 15,
                            className: "animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/OtpChallenge.tsx",
                            lineNumber: 470,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Verifying…"
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/OtpChallenge.tsx",
                            lineNumber: 471,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                            size: 15
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/OtpChallenge.tsx",
                            lineNumber: 475,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Verify Code"
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/OtpChallenge.tsx",
                            lineNumber: 476,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                lineNumber: 461,
                columnNumber: 9
            }, this),
            !isLocked && !isSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onCancel,
                        disabled: challengeState === 'submitting' || challengeState === 'resending',
                        className: "flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                        id: "otp-back-btn",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                                lineNumber: 496,
                                columnNumber: 13
                            }, this),
                            "Back"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 486,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleResend,
                        disabled: isResendDisabled,
                        className: "flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                        id: "otp-resend-btn",
                        children: challengeState === 'resending' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    size: 13,
                                    className: "animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/OtpChallenge.tsx",
                                    lineNumber: 510,
                                    columnNumber: 17
                                }, this),
                                "Sending…"
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    size: 13,
                                    className: countdownActive ? '' : 'text-slate-900'
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/OtpChallenge.tsx",
                                    lineNumber: 515,
                                    columnNumber: 17
                                }, this),
                                countdownActive ? `Resend in ${formatCountdown(countdown)}` : 'Resend code'
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 501,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                lineNumber: 484,
                columnNumber: 9
            }, this),
            isLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-500",
                        children: [
                            "Please wait 15 minutes and try again, or contact",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "mailto:support@sawaflix.com",
                                className: "underline text-slate-700 hover:text-slate-900",
                                children: "support@sawaflix.com"
                            }, void 0, false, {
                                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                                lineNumber: 530,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 528,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onCancel,
                        className: "mt-3 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors mx-auto",
                        id: "otp-locked-back-btn",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                                lineNumber: 543,
                                columnNumber: 13
                            }, this),
                            "Back to Login"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Auth/OtpChallenge.tsx",
                        lineNumber: 537,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Auth/OtpChallenge.tsx",
                lineNumber: 527,
                columnNumber: 9
            }, this)
        ]
    }, "otp-challenge", true, {
        fileName: "[project]/components/Auth/OtpChallenge.tsx",
        lineNumber: 332,
        columnNumber: 5
    }, this);
}
_s(OtpChallenge, "7qatndLnpVv7rVbHZ/Y5LLahhbA=");
_c = OtpChallenge;
var _c;
__turbopack_context__.k.register(_c, "OtpChallenge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/SawaflixLogo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SawaflixIcon",
    ()=>SawaflixIcon,
    "SawaflixLoader",
    ()=>SawaflixLoader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
;
const SawaflixLogo = ({ className = "", height = 34, theme = 'light' })=>{
    // Calculate width from the SVG's natural aspect ratio: 244.75 / 56.56 ≈ 4.327
    const width = Math.round(height * (244.75 / 56.56));
    const src = theme === 'dark' ? '/Asset 10.svg' : '/logo/logo.svg';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: src,
            alt: "SawaFlix",
            width: width,
            height: height,
            priority: true,
            unoptimized: true
        }, void 0, false, {
            fileName: "[project]/components/SawaflixLogo.tsx",
            lineNumber: 17,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/SawaflixLogo.tsx",
        lineNumber: 16,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = SawaflixLogo;
const SawaflixIcon = ({ size = 32, className = "" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: "/Asset 8.svg",
            alt: "SawaFlix",
            width: size,
            height: size,
            priority: true,
            unoptimized: true
        }, void 0, false, {
            fileName: "[project]/components/SawaflixLogo.tsx",
            lineNumber: 32,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/SawaflixLogo.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c1 = SawaflixIcon;
const SawaflixLoader = ({ size = 64, className = "", text })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col items-center justify-center gap-3.5 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 rounded-full bg-red-500/10 blur-sm pointer-events-none"
                    }, void 0, false, {
                        fileName: "[project]/components/SawaflixLogo.tsx",
                        lineNumber: 48,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/loaderLogo.png",
                        alt: "Loading...",
                        width: size,
                        height: size,
                        priority: true,
                        unoptimized: true,
                        className: "animate-spin object-contain drop-shadow-md",
                        style: {
                            animationDuration: '1.1s'
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/SawaflixLogo.tsx",
                        lineNumber: 49,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/SawaflixLogo.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            text && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs font-semibold text-slate-600 tracking-wide",
                children: text
            }, void 0, false, {
                fileName: "[project]/components/SawaflixLogo.tsx",
                lineNumber: 61,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/SawaflixLogo.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c2 = SawaflixLoader;
const __TURBOPACK__default__export__ = SawaflixLogo;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SawaflixLogo");
__turbopack_context__.k.register(_c1, "SawaflixIcon");
__turbopack_context__.k.register(_c2, "SawaflixLoader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Auth$2f$OtpChallenge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Auth/OtpChallenge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SawaflixLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SawaflixLogo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/authService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/errorMessages.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function LoginContent() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const urlError = searchParams.get('error');
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('credentials');
    const [challenge, setChallenge] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(urlError ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFriendlyError"])(urlError) : null);
    const redirectToAdmin = ()=>{
        setStep('redirecting');
        window.location.assign('/admin');
    };
    const handleSubmit = async (event)=>{
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const nextChallenge = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startAdminLogin"])(email, password);
            setPassword('');
            // Admin backend: no OTP — redirect straight to dashboard
            if (!nextChallenge.requiresTwoFactor) {
                redirectToAdmin();
                return;
            }
            // Main backend with 2FA: show OTP challenge screen
            setChallenge(nextChallenge);
            setStep('challenge');
        } catch (loginError) {
            setError(loginError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TwoFAError"] ? loginError.message : (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$errorMessages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFriendlyError"])(loginError));
        } finally{
            setIsLoading(false);
        }
    };
    const cancelChallenge = ()=>{
        setChallenge(null);
        setStep('credentials');
        setError(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8F9FB] p-4 font-inter sm:p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-100/50 blur-3xl"
            }, void 0, false, {
                fileName: "[project]/app/login/page.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-slate-200/60 blur-3xl"
            }, void 0, false, {
                fileName: "[project]/app/login/page.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative z-10 w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-7 text-left shadow-xl shadow-slate-200/50 sm:p-9",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "mb-6 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 inline-flex rounded-2xl border border-slate-200/80 bg-slate-50 p-3 shadow-2xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/loaderLogo.png",
                                    alt: "SawaFlix",
                                    width: 40,
                                    height: 40,
                                    priority: true,
                                    className: "h-10 w-10 object-contain"
                                }, void 0, false, {
                                    fileName: "[project]/app/login/page.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-extrabold tracking-normal text-slate-900",
                                children: "SawaFlix Admin"
                            }, void 0, false, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs text-slate-500",
                                children: "Secure management portal"
                            }, void 0, false, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/login/page.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    step === 'redirecting' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                size: 16,
                                className: "text-emerald-600"
                            }, void 0, false, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this),
                            "Verification complete. Opening dashboard..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/login/page.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    error && step === 'credentials' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "alert",
                        className: "mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-800",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/login/page.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    step === 'credentials' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "admin-email",
                                        className: "mb-1.5 block text-xs font-semibold text-slate-700",
                                        children: "Admin email address"
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 116,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                size: 16,
                                                className: "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/page.tsx",
                                                lineNumber: 123,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: "admin-email",
                                                type: "email",
                                                value: email,
                                                onChange: (event)=>setEmail(event.target.value),
                                                autoComplete: "username email",
                                                required: true,
                                                disabled: isLoading,
                                                placeholder: "admin@sawaflix.com",
                                                className: "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-2xs outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-60"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/page.tsx",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "admin-password",
                                        className: "mb-1.5 block text-xs font-semibold text-slate-700",
                                        children: "Password"
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                size: 16,
                                                className: "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/page.tsx",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: "admin-password",
                                                type: showPassword ? 'text' : 'password',
                                                value: password,
                                                onChange: (event)=>setPassword(event.target.value),
                                                autoComplete: "current-password",
                                                required: true,
                                                disabled: isLoading,
                                                placeholder: "Enter your password",
                                                className: "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 shadow-2xs outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-60"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/page.tsx",
                                                lineNumber: 153,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setShowPassword((visible)=>!visible),
                                                disabled: isLoading,
                                                "aria-label": showPassword ? 'Hide password' : 'Show password',
                                                className: "absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition hover:text-slate-700",
                                                children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/app/login/page.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 35
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/app/login/page.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 58
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: isLoading,
                                className: "flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50",
                                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/login/page.tsx",
                                            lineNumber: 183,
                                            columnNumber: 19
                                        }, this),
                                        "Checking credentials..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        "Continue securely ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/app/login/page.tsx",
                                            lineNumber: 188,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/login/page.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this),
                    step === 'challenge' && challenge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Auth$2f$OtpChallenge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        challengeId: challenge.challengeId,
                        deliveryAddress: challenge.deliveryAddress,
                        expiresInSeconds: challenge.expiresInSeconds,
                        onSuccess: redirectToAdmin,
                        onCancel: cancelChallenge
                    }, void 0, false, {
                        fileName: "[project]/app/login/page.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-6 text-center text-[11px] text-slate-400",
                        children: "Authorized personnel only - SawaFlix Media Network"
                    }, void 0, false, {
                        fileName: "[project]/app/login/page.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/login/page.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/login/page.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(LoginContent, "GMjtLEDkXDxustdFglHEd4Flhqw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = LoginContent;
function LoginPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-[#F8F9FB]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SawaflixLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SawaflixLoader"], {
                size: 48,
                text: "Loading secure sign-in..."
            }, void 0, false, {
                fileName: "[project]/app/login/page.tsx",
                lineNumber: 218,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/login/page.tsx",
            lineNumber: 217,
            columnNumber: 9
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginContent, {}, void 0, false, {
            fileName: "[project]/app/login/page.tsx",
            lineNumber: 222,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/login/page.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, this);
}
_c1 = LoginPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "LoginContent");
__turbopack_context__.k.register(_c1, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0c_o~k8._.js.map
(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/contexts/AdminNotificationContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminNotificationProvider",
    ()=>AdminNotificationProvider,
    "useAdminNotifications",
    ()=>useAdminNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const AdminNotificationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AdminNotificationProvider({ children }) {
    _s();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const unreadCount = notifications.filter((n)=>!n.read).length;
    const addNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AdminNotificationProvider.useCallback[addNotification]": (n)=>{
            const newNotification = {
                ...n,
                id: Math.random().toString(36).substring(2, 9),
                read: false,
                timestamp: new Date()
            };
            setNotifications({
                "AdminNotificationProvider.useCallback[addNotification]": (prev)=>[
                        newNotification,
                        ...prev
                    ].slice(0, 50)
            }["AdminNotificationProvider.useCallback[addNotification]"]); // Keep last 50
        }
    }["AdminNotificationProvider.useCallback[addNotification]"], []);
    const markRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AdminNotificationProvider.useCallback[markRead]": (id)=>{
            setNotifications({
                "AdminNotificationProvider.useCallback[markRead]": (prev)=>prev.map({
                        "AdminNotificationProvider.useCallback[markRead]": (n)=>n.id === id ? {
                                ...n,
                                read: true
                            } : n
                    }["AdminNotificationProvider.useCallback[markRead]"])
            }["AdminNotificationProvider.useCallback[markRead]"]);
        }
    }["AdminNotificationProvider.useCallback[markRead]"], []);
    const markAllRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AdminNotificationProvider.useCallback[markAllRead]": ()=>{
            setNotifications({
                "AdminNotificationProvider.useCallback[markAllRead]": (prev)=>prev.map({
                        "AdminNotificationProvider.useCallback[markAllRead]": (n)=>({
                                ...n,
                                read: true
                            })
                    }["AdminNotificationProvider.useCallback[markAllRead]"])
            }["AdminNotificationProvider.useCallback[markAllRead]"]);
        }
    }["AdminNotificationProvider.useCallback[markAllRead]"], []);
    const clearAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AdminNotificationProvider.useCallback[clearAll]": ()=>{
            setNotifications([]);
        }
    }["AdminNotificationProvider.useCallback[clearAll]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AdminNotificationContext.Provider, {
        value: {
            notifications,
            unreadCount,
            addNotification,
            markRead,
            markAllRead,
            clearAll
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/AdminNotificationContext.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(AdminNotificationProvider, "Y6GxpAk37FOmIPZuedRbS9ZQvqs=");
_c = AdminNotificationProvider;
function useAdminNotifications() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AdminNotificationContext);
    if (context === undefined) {
        throw new Error('useAdminNotifications must be used within an AdminNotificationProvider');
    }
    return context;
}
_s1(useAdminNotifications, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AdminNotificationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Common/TopLoader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TopLoader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function TopLoader() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Reset/complete loader whenever pathname or search parameters change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopLoader.useEffect": ()=>{
            if (visible) {
                setProgress(100);
                const timer = setTimeout({
                    "TopLoader.useEffect.timer": ()=>{
                        setVisible(false);
                        setProgress(0);
                    }
                }["TopLoader.useEffect.timer"], 300);
                return ({
                    "TopLoader.useEffect": ()=>clearTimeout(timer)
                })["TopLoader.useEffect"];
            }
        }
    }["TopLoader.useEffect"], [
        pathname,
        searchParams
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopLoader.useEffect": ()=>{
            // Global event listeners for manual triggering (e.g. during content fetching)
            const handleStart = {
                "TopLoader.useEffect.handleStart": ()=>{
                    setVisible(true);
                    setProgress(25);
                    setTimeout({
                        "TopLoader.useEffect.handleStart": ()=>setProgress({
                                "TopLoader.useEffect.handleStart": (prev)=>prev < 65 ? 65 : prev
                            }["TopLoader.useEffect.handleStart"])
                    }["TopLoader.useEffect.handleStart"], 100);
                    setTimeout({
                        "TopLoader.useEffect.handleStart": ()=>setProgress({
                                "TopLoader.useEffect.handleStart": (prev)=>prev < 85 ? 85 : prev
                            }["TopLoader.useEffect.handleStart"])
                    }["TopLoader.useEffect.handleStart"], 250);
                }
            }["TopLoader.useEffect.handleStart"];
            const handleStop = {
                "TopLoader.useEffect.handleStop": ()=>{
                    setProgress(100);
                    setTimeout({
                        "TopLoader.useEffect.handleStop": ()=>{
                            setVisible(false);
                            setProgress(0);
                        }
                    }["TopLoader.useEffect.handleStop"], 300);
                }
            }["TopLoader.useEffect.handleStop"];
            window.addEventListener('toploader:start', handleStart);
            window.addEventListener('toploader:stop', handleStop);
            // Global link click handler for instant feedback before navigation starts
            const handleClick = {
                "TopLoader.useEffect.handleClick": (e)=>{
                    const target = e.target?.closest('a');
                    if (!target) return;
                    const href = target.getAttribute('href');
                    const targetAttr = target.getAttribute('target');
                    // Only handle internal links without new tab or download
                    if (href && href.startsWith('/') && !href.startsWith('//') && targetAttr !== '_blank' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
                        if (href !== pathname) {
                            handleStart();
                        }
                    }
                }
            }["TopLoader.useEffect.handleClick"];
            document.addEventListener('click', handleClick, {
                capture: true
            });
            return ({
                "TopLoader.useEffect": ()=>{
                    window.removeEventListener('toploader:start', handleStart);
                    window.removeEventListener('toploader:stop', handleStop);
                    document.removeEventListener('click', handleClick, {
                        capture: true
                    });
                }
            })["TopLoader.useEffect"];
        }
    }["TopLoader.useEffect"], [
        pathname
    ]);
    if (!visible && progress === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200",
        style: {
            opacity: visible || progress > 0 ? 1 : 0
        },
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-rose-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(239,68,68,0.8)]",
                style: {
                    width: `${progress}%`
                }
            }, void 0, false, {
                fileName: "[project]/components/Common/TopLoader.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 right-0 h-[3px] w-24 bg-gradient-to-r from-transparent to-white/90 blur-[1px]",
                style: {
                    transform: `translateX(${progress - 100}%)`,
                    display: progress > 0 && progress < 100 ? 'block' : 'none'
                }
            }, void 0, false, {
                fileName: "[project]/components/Common/TopLoader.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Common/TopLoader.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(TopLoader, "TuvOIMvMzBjnTbswmie4TYmGe50=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = TopLoader;
var _c;
__turbopack_context__.k.register(_c, "TopLoader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0j.0nqg._.js.map
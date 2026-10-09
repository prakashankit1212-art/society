const adminModules = [
  { key: "profile", label: "Profile", title: "Profile", description: "Manage your name, contact details, and account photo.", icon: "user", to: "/admin/profile" },
  { key: "society", label: "Society", title: "Society information", description: "View society contact details and current membership counts.", icon: "building", to: "/admin/society" },
  { key: "blocks", label: "Blocks", title: "Blocks", description: "View the blocks and resident counts in your society.", icon: "building", to: "/admin/blocks" },
  { key: "administration", label: "Administration", title: "Administration", description: "Review your role, permissions, and managed areas.", icon: "shield", to: "/admin/administration" },
  { key: "notifications", label: "Notifications", title: "Notification preferences", description: "Choose which updates this browser-based account tracks.", icon: "bell", to: "/admin/notifications" },
  { key: "security", label: "Security", title: "Security", description: "Manage password settings and inspect this browser session.", icon: "lock", to: "/admin/security" },
  { key: "activity", label: "Activity", title: "Account activity", description: "Review recent changes recorded by this browser.", icon: "clock", to: "/admin/activity" },
  { key: "services", label: "Connected services", title: "Connected services", description: "Check available integrations and browser permissions.", icon: "settings", to: "/admin/services" },
  { key: "account", label: "Account actions", title: "Account actions", description: "Sign out here or review account-level actions.", icon: "logout", to: "/admin/account" }
];

export default adminModules;
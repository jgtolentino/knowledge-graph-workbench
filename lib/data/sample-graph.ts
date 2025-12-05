import type { GraphData } from "@/lib/types/graph"

// Sample knowledge graph data for demonstration
export const sampleGraphData: GraphData = {
  nodes: [
    // Apps
    { id: "app-guardian", type: "app", label: "Guardian", slug: "guardian", importance: 1, status: "healthy" },
    { id: "app-workbench", type: "app", label: "Workbench", slug: "workbench", importance: 0.9, status: "healthy" },
    { id: "app-dashboard", type: "app", label: "Dashboard", slug: "dashboard", importance: 0.8, status: "warning" },

    // Agents
    { id: "agent-spec", type: "agent", label: "Spec Agent", importance: 0.85, status: "healthy" },
    { id: "agent-monitor", type: "agent", label: "Monitor Agent", importance: 0.75, status: "healthy" },
    { id: "agent-deploy", type: "agent", label: "Deploy Agent", importance: 0.7, status: "warning" },

    // Guardian Spec Kit
    {
      id: "spec-guardian-constitution",
      type: "spec_constitution",
      label: "Guardian Constitution",
      slug: "guardian",
      importance: 0.8,
    },
    { id: "spec-guardian-prd", type: "spec_prd", label: "Guardian PRD", slug: "guardian", importance: 0.75 },
    { id: "spec-guardian-plan", type: "spec_plan", label: "Guardian Plan", slug: "guardian", importance: 0.6 },
    { id: "spec-guardian-tasks", type: "spec_tasks", label: "Guardian Tasks", slug: "guardian", importance: 0.65 },

    // Workbench Spec Kit
    {
      id: "spec-workbench-constitution",
      type: "spec_constitution",
      label: "Workbench Constitution",
      slug: "workbench",
      importance: 0.75,
    },
    { id: "spec-workbench-prd", type: "spec_prd", label: "Workbench PRD", slug: "workbench", importance: 0.7 },
    { id: "spec-workbench-plan", type: "spec_plan", label: "Workbench Plan", slug: "workbench", importance: 0.55 },
    { id: "spec-workbench-tasks", type: "spec_tasks", label: "Workbench Tasks", slug: "workbench", importance: 0.6 },

    // Database Tables
    { id: "table-users", type: "supabase_table", label: "users", importance: 0.9, status: "healthy" },
    { id: "table-projects", type: "supabase_table", label: "projects", importance: 0.85, status: "healthy" },
    { id: "table-specs", type: "supabase_table", label: "specs", importance: 0.8, status: "healthy" },
    { id: "table-events", type: "supabase_table", label: "events", importance: 0.7, status: "healthy" },
    { id: "table-issues", type: "supabase_table", label: "issues", importance: 0.75, status: "warning" },

    // Edge Functions
    { id: "fn-auth", type: "edge_function", label: "auth-handler", importance: 0.85, status: "healthy" },
    { id: "fn-webhook", type: "edge_function", label: "webhook-processor", importance: 0.7, status: "healthy" },
    { id: "fn-notify", type: "edge_function", label: "notification-sender", importance: 0.65, status: "warning" },

    // Cron Jobs
    { id: "cron-cleanup", type: "cron_job", label: "daily-cleanup", importance: 0.5, status: "healthy" },
    { id: "cron-sync", type: "cron_job", label: "sync-external", importance: 0.6, status: "healthy" },
    { id: "cron-report", type: "cron_job", label: "weekly-report", importance: 0.55, status: "healthy" },

    // Monitors
    { id: "monitor-uptime", type: "monitor", label: "Uptime Monitor", importance: 0.8, status: "healthy" },
    { id: "monitor-perf", type: "monitor", label: "Performance Monitor", importance: 0.75, status: "warning" },
    { id: "monitor-error", type: "monitor", label: "Error Tracker", importance: 0.85, status: "healthy" },

    // Recent Events
    { id: "event-deploy-1", type: "event", label: "Deployment v2.1", importance: 0.4, createdAt: "2025-06-10" },
    { id: "event-deploy-2", type: "event", label: "Deployment v2.0", importance: 0.3, createdAt: "2025-06-05" },

    // Issues
    { id: "issue-1", type: "issue", label: "Memory leak in worker", importance: 0.9, status: "error" },
    { id: "issue-2", type: "issue", label: "Slow query performance", importance: 0.7, status: "warning" },
    { id: "issue-3", type: "issue", label: "Auth timeout errors", importance: 0.6, status: "warning" },
  ],
  edges: [
    // Apps to Spec Kits
    { id: "e1", from: "app-guardian", to: "spec-guardian-constitution", type: "has_spec" },
    { id: "e2", from: "app-guardian", to: "spec-guardian-prd", type: "has_spec" },
    { id: "e3", from: "app-guardian", to: "spec-guardian-plan", type: "has_spec" },
    { id: "e4", from: "app-guardian", to: "spec-guardian-tasks", type: "has_spec" },
    { id: "e5", from: "app-workbench", to: "spec-workbench-constitution", type: "has_spec" },
    { id: "e6", from: "app-workbench", to: "spec-workbench-prd", type: "has_spec" },
    { id: "e7", from: "app-workbench", to: "spec-workbench-plan", type: "has_spec" },
    { id: "e8", from: "app-workbench", to: "spec-workbench-tasks", type: "has_spec" },

    // Apps to Tables
    { id: "e9", from: "app-guardian", to: "table-users", type: "uses_table" },
    { id: "e10", from: "app-guardian", to: "table-projects", type: "uses_table" },
    { id: "e11", from: "app-guardian", to: "table-specs", type: "uses_table" },
    { id: "e12", from: "app-workbench", to: "table-users", type: "uses_table" },
    { id: "e13", from: "app-dashboard", to: "table-events", type: "uses_table" },
    { id: "e14", from: "app-dashboard", to: "table-issues", type: "uses_table" },

    // Agents to Apps
    { id: "e15", from: "agent-spec", to: "app-guardian", type: "monitors" },
    { id: "e16", from: "agent-monitor", to: "app-guardian", type: "monitors" },
    { id: "e17", from: "agent-monitor", to: "app-workbench", type: "monitors" },
    { id: "e18", from: "agent-deploy", to: "app-guardian", type: "triggers" },

    // Functions to Tables
    { id: "e19", from: "fn-auth", to: "table-users", type: "uses_table" },
    { id: "e20", from: "fn-webhook", to: "table-events", type: "uses_table" },
    { id: "e21", from: "fn-notify", to: "table-users", type: "uses_table" },

    // Cron to Functions
    { id: "e22", from: "cron-cleanup", to: "table-events", type: "triggers" },
    { id: "e23", from: "cron-sync", to: "fn-webhook", type: "triggers" },
    { id: "e24", from: "cron-report", to: "fn-notify", type: "triggers" },

    // Monitors to Apps
    { id: "e25", from: "monitor-uptime", to: "app-guardian", type: "monitors" },
    { id: "e26", from: "monitor-uptime", to: "app-workbench", type: "monitors" },
    { id: "e27", from: "monitor-perf", to: "app-guardian", type: "monitors" },
    { id: "e28", from: "monitor-error", to: "app-dashboard", type: "monitors" },

    // Issues relationships
    { id: "e29", from: "issue-1", to: "app-guardian", type: "related_to" },
    { id: "e30", from: "issue-2", to: "table-specs", type: "related_to" },
    { id: "e31", from: "issue-3", to: "fn-auth", type: "related_to" },
    { id: "e32", from: "monitor-error", to: "issue-1", type: "caused_by" },

    // Events to apps
    { id: "e33", from: "event-deploy-1", to: "app-guardian", type: "related_to" },
    { id: "e34", from: "event-deploy-2", to: "app-guardian", type: "related_to" },

    // Spec inter-relationships
    { id: "e35", from: "spec-guardian-constitution", to: "spec-guardian-prd", type: "depends_on" },
    { id: "e36", from: "spec-guardian-prd", to: "spec-guardian-plan", type: "depends_on" },
    { id: "e37", from: "spec-guardian-plan", to: "spec-guardian-tasks", type: "depends_on" },
  ],
}

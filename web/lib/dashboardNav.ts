export type NavItem = { label: string; href: string; icon: string };

// Mirrors the per-persona navigation maps in docs/USER_STORIES.md §2-11.
// Items not yet backed by a real service route to /dashboard/coming-soon
// with a note on which Phase 1 sprint (per PHASE_1_PLAN.md) delivers them.
export const roleNav: Record<string, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "Schools & Tenants", href: "/dashboard/admin/tenants", icon: "school" },
    { label: "Users & Roles", href: "/dashboard/coming-soon?feature=Users%20%26%20Roles", icon: "users" },
    { label: "Course Catalog", href: "/dashboard/admin/courses", icon: "book" },
    { label: "Payments & Billing", href: "/dashboard/coming-soon?feature=Payments%20%26%20Billing", icon: "dollar" },
    { label: "Audit Log", href: "/dashboard/coming-soon?feature=Audit%20Log", icon: "audit" },
    { label: "Settings", href: "/dashboard/settings", icon: "gear" },
  ],
  STUDENT: [
    { label: "Home", href: "/dashboard", icon: "home" },
    { label: "My Courses", href: "/dashboard/student/courses", icon: "book" },
    { label: "Pathways", href: "/#pathways", icon: "map" },
    { label: "Live Classes", href: "/dashboard/coming-soon?feature=Live%20Classes", icon: "video" },
    { label: "Assignments & Grades", href: "/dashboard/coming-soon?feature=Assignments%20%26%20Grades", icon: "clipboard" },
    { label: "Certificates", href: "/dashboard/coming-soon?feature=Certificates", icon: "award" },
    { label: "Billing", href: "/dashboard/coming-soon?feature=Billing", icon: "card" },
    { label: "Settings", href: "/dashboard/settings", icon: "gear" },
  ],
  TEACHER: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "My Courses", href: "/dashboard/teacher/courses", icon: "book" },
    { label: "My Classes / Roster", href: "/dashboard/teacher/roster", icon: "users" },
    { label: "Live Sessions", href: "/dashboard/coming-soon?feature=Live%20Sessions", icon: "video" },
    { label: "Gradebook", href: "/dashboard/coming-soon?feature=Gradebook", icon: "clipboard" },
    { label: "Settings", href: "/dashboard/settings", icon: "gear" },
  ],
  SCHOOL_ADMIN: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "School Profile", href: "/dashboard/school/profile", icon: "school" },
    { label: "Staff & Teachers", href: "/dashboard/school/teachers", icon: "users" },
    { label: "Students & Enrollment", href: "/dashboard/school/roster", icon: "clipboard" },
    { label: "Curriculum & Pathways", href: "/dashboard/coming-soon?feature=Curriculum%20%26%20Pathways", icon: "map" },
    { label: "Billing", href: "/dashboard/coming-soon?feature=School%20Billing", icon: "dollar" },
    { label: "Reports", href: "/dashboard/coming-soon?feature=Reports", icon: "chart" },
    { label: "Settings", href: "/dashboard/settings", icon: "gear" },
  ],
  PARENT: [
    { label: "Home", href: "/dashboard", icon: "home" },
    { label: "Progress & Grades", href: "/dashboard/coming-soon?feature=Progress%20%26%20Grades", icon: "chart" },
    { label: "Schedule", href: "/dashboard/coming-soon?feature=Schedule", icon: "calendar" },
    { label: "Billing", href: "/dashboard/coming-soon?feature=Billing", icon: "card" },
    { label: "Consent & Privacy", href: "/dashboard/parent/children", icon: "audit" },
    { label: "Settings", href: "/dashboard/settings", icon: "gear" },
  ],
  COURSE_PROVIDER: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "My Courses", href: "/dashboard/coming-soon?feature=Published%20Courses", icon: "book" },
    { label: "Revenue & Royalties", href: "/dashboard/coming-soon?feature=Revenue%20%26%20Royalties", icon: "dollar" },
    { label: "Analytics", href: "/dashboard/coming-soon?feature=Content%20Analytics", icon: "chart" },
    { label: "Settings", href: "/dashboard/settings", icon: "gear" },
  ],
  SALES: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "Leads", href: "/dashboard/coming-soon?feature=Leads%20queue", icon: "megaphone" },
    { label: "Accounts", href: "/dashboard/coming-soon?feature=Accounts", icon: "briefcase" },
    { label: "Contracts & Quotes", href: "/dashboard/coming-soon?feature=Contracts%20%26%20Quotes", icon: "file" },
    { label: "Settings", href: "/dashboard/settings", icon: "gear" },
  ],
  MARKETING: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "CMS Pages", href: "/dashboard/coming-soon?feature=CMS%20Pages", icon: "file" },
    { label: "Newsroom/Blog", href: "/dashboard/coming-soon?feature=Newsroom%20publishing", icon: "megaphone" },
    { label: "Campaigns", href: "/dashboard/coming-soon?feature=Campaigns", icon: "chart" },
    { label: "Settings", href: "/dashboard/settings", icon: "gear" },
  ],
  SCHOOL_STAFF: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "Attendance", href: "/dashboard/coming-soon?feature=Attendance", icon: "clipboard" },
    { label: "Schedule", href: "/dashboard/coming-soon?feature=Schedule", icon: "calendar" },
    { label: "Student Records", href: "/dashboard/coming-soon?feature=Student%20Records", icon: "file" },
    { label: "Support Tickets", href: "/dashboard/coming-soon?feature=Support%20Tickets", icon: "ticket" },
    { label: "Settings", href: "/dashboard/settings", icon: "gear" },
  ],
};

export const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  STUDENT: "Student",
  TEACHER: "Teacher",
  SCHOOL_ADMIN: "School Admin",
  PARENT: "Parent",
  COURSE_PROVIDER: "Course Provider",
  SALES: "Sales",
  MARKETING: "Marketing",
  SCHOOL_STAFF: "School Staff",
};

export function navForRoles(roles: string[]): NavItem[] {
  if (roles.length === 0) return roleNav.STUDENT;
  const seen = new Set<string>();
  const items: NavItem[] = [];
  for (const role of roles) {
    for (const item of roleNav[role] ?? []) {
      if (!seen.has(item.label)) {
        seen.add(item.label);
        items.push(item);
      }
    }
  }
  return items;
}

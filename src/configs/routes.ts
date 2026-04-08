export const AppRoutes = {
  // Dashboard
  Dashboard: '/admin/dashboard',
  QuestionnaireGroups: '/admin/questionnaire-groups',

  // Auth
  SignIn: '/sign-in',
  Logout: process.env.NEXT_PUBLIC_SSO_LOGOUT_PAGE || '/logout',

  // Account
  Account: '/admin/account',

  // User
  Users: '/admin/users',

  // Settings
  Settings: '/admin/settings',

  // Errors
  Unauthorized: '/errors/unauthorized',
  Forbidden: '/errors/forbidden',
  NotFound: '/errors/not-found',
  InternalServerError: '/errors/internal-server-error',
  Maintenance: '/errors/maintenance',
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];

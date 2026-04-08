import { ClipboardList, LayoutDashboard, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type SidebarData } from '@/types/sidebar';
import { IIGIIcon } from '@/components/icons/iig-icon';
import { AppRoutes } from './routes';

export function useSidebarData(): SidebarData {
  const t = useTranslations('sidebar');

  return {
    info: {
      name: 'ELearning Admin',
      logo: IIGIIcon,
      plan: 'IIG Vietnam',
    },
    navGroups: [
      {
        title: t('general'),
        items: [
          {
            title: t('dashboard'),
            url: AppRoutes.Dashboard,
            icon: LayoutDashboard,
          },

          {
            title: t('questionnaireGroups'),
            url: AppRoutes.QuestionnaireGroups,
            icon: ClipboardList,
          },

          {
            title: t('users'),
            url: AppRoutes.Users,
            icon: Users,
          },
        ],
      },
    ],
  };
}

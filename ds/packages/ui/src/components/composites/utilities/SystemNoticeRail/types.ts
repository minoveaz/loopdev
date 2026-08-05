import { SuiteNotice } from '../../workspace/SuiteHomeLayout/types';

export interface SystemNoticeRailProps {
  notices: SuiteNotice[];
  onViewAll?: () => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

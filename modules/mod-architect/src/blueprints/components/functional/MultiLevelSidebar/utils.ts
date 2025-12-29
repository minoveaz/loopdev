export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  children?: SidebarItem[];
}

export const hasChildren = (item: SidebarItem): boolean => {
  return item.children !== undefined && item.children.length > 0;
};

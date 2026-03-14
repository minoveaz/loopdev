import React from 'react';

const Link = ({ children, href, ...props }: any) => {
  return <a href={href} {...props}>{children}</a>;
};

export default Link;

export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
});

export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({});

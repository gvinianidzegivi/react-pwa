import type { ReactNode } from "react";

type PropsType = {
  children: ReactNode
};

export const Layout = ({ children }: PropsType) => {
  return <div className="p-4 max-w-l mx-auto h-full">{children}</div>
};

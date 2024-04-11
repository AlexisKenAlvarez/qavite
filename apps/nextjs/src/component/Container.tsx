import { cn } from "@qavite/ui";
import { ReactNode } from "react";

const Container = ({ className, children }: { className?: string, children: ReactNode }) => {
  return <section className={cn("w-full p-5 relative", className)}>{children}</section>;
};

export default Container;

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ParentChildrenClient } from "./ParentChildrenClient";

export default async function ParentChildrenPage() {
  const session = await getSession();
  if (!session || !session.roles.includes("PARENT")) {
    redirect("/dashboard");
  }

  return <ParentChildrenClient />;
}

import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NewsAggregator from "@/components/NewsAggregator";

export default async function NewsPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  return <NewsAggregator user={user} />;
}
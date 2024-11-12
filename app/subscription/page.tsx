import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Subscriton = () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  return <h1>subscription page</h1>;
};

export default Subscriton;

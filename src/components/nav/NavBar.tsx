import { UserButton } from "@stackframe/stack";
import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { Button } from "../ui/button";

const NavBar = async () => {
  const user = await stackServerApp.getUser();

  return (
    <div>
      <h1>
        <Link href="/">Take Action</Link>
      </h1>
      {user ? (
        <UserButton />
      ) : (
        <>
          <Button>
            <Link href="/handler/signin">Sign In</Link>
          </Button>
          <Button>
            <Link href="/handler/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default NavBar;

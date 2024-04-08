"use client";

import { api } from "@/trpc/client";

const Hero = () => {
  const createUserMutation = api.auth.createUser.useMutation();

  return (
    <div>
      <button
        onClick={async () =>
          await createUserMutation.mutateAsync({
            email: "ju@cvsu.edu.ph",
            password: "password",
            firstname: "Juan",
            lastname: "Dela Cruz",
          })
        }
      >
        Click me
      </button>
    </div>
  );
};

export default Hero;

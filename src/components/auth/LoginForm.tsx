import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/utils/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { config } from "@/utils/config";
import { useRootContext } from "../../hooks/useRootContext";
import { Link } from "react-router";

const loginSchema = z.object({
  email: z.string().email(),
});

export function LoginForm() {
  const rootContext = useRootContext();
  const magicLinkMutation = useMutation({
    mutationFn: async (email: string) => {
      let callbackURL = `${config.VITE_WEBAPP_URL}/link/auth/callback?type=magic-link`;
      if (rootContext.isAndroid) {
        callbackURL += `&redirect=${config.VITE_ANDROIDAPP_DEEPLINK}?type=magic-link`;
      }
      const { data, error } = await authClient.signIn.magicLink({
        email,
        callbackURL,
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await magicLinkMutation.mutateAsync(values.email);
  }

  if (magicLinkMutation.isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6")}>
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              A magic link has been sent to your email. <br /> Click the link to
              login.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/update">App Update</Link>
          </Button>

          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Send Magic Link
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

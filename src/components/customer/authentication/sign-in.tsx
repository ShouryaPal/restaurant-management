import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { loginSchema } from "../../../schema/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUserStore from "../../../hooks/user";

const SignIn = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const { setUser, refetchUser } = useUserStore();

  const handleCustomerSignUp = () => {
    navigate("/customer/signup");
  };

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/customer/auth/login`,
        values,
        { withCredentials: true }
      );
      console.log("Login successful:", response.data);

      const userData = await refetchUser();
      if (userData) {
        setUser(userData);
        navigate("/customer/home");
      } else {
        console.error("Failed to fetch user data after login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data);
        console.error("An unexpected error occurred:", error);
      }
    }
  }

  return (
    <main className="w-full h-screen bg-orange-300 flex items-center justify-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Place in your table</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="xyz@xyz.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="xyz" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button>Sign In</Button>
              <section className="text-center">
                {" "}
                Not an account ?
                <Button variant={"link"} onClick={handleCustomerSignUp}>
                  Sign Up
                </Button>
              </section>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
};

export default SignIn;

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
import { Toaster, toast } from "sonner"; // Import Toaster and toast from sonner

const SignUp = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const handleCustomerSignIn = () => {
    navigate("/customer/signin");
  };

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const email = values.email;
      const password = values.password;
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/customer/auth/register`,
        {
          email,
          password,
        }
      );
      if (res) {
        console.log("signup successful");
        toast.success("Signup successful!"); // Show success toast
        setTimeout(() => {
          navigate("/customer/signin"); // Navigate to signin page after a short delay
        }, 1500); // Delay of 1.5 seconds
      }
    } catch (err) {
      console.log(err);
      toast.error("Signup failed. Please try again."); // Show error toast
    }
  }

  return (
    <main className="w-full h-screen bg-orange-300 flex items-center justify-center">
      <Toaster position="top-center" /> 
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
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
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit">Sign Up</Button>
              <section className="text-center">
                Already have an account?
                <Button variant={"link"} onClick={handleCustomerSignIn}>
                  Sign In
                </Button>
              </section>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
};

export default SignUp;

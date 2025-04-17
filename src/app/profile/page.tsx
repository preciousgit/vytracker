
import { Button } from "@/components/registry/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/registry/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, Lock, User, Wallet } from "lucide-react";

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
        </header>
        <div className="p-4 md:p-6 w-full max-w-full">
          <div className="mb-8 flex flex-col items-center space-y-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/avatars/shadcn.jpg" alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold">shadcn</h2>
              <p className="text-muted-foreground">m@example.com</p>
            </div>
            <Button variant="outline" size="sm">
              Change Avatar
            </Button>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <div className="border-b">
              <div className="w-full flex justify-center">
                <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                  <TabsTrigger value="personal">
                    <User className="mr-2 h-4 w-4 hidden sm:block" />
                    <span className="sm:inline">Personal Info</span>
                    <span className="sm:hidden">Personal</span>
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Lock className="mr-2 h-4 w-4 hidden sm:block" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="payment">
                    <CreditCard className="mr-2 h-4 w-4 hidden sm:block" />
                    <span className="sm:inline">Payment Methods</span>
                    <span className="sm:hidden">Payment</span>
                  </TabsTrigger>
                  <TabsTrigger value="billing">
                    <Wallet className="mr-2 h-4 w-4 hidden sm:block" />
                    Billing
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-4xl px-4">
                <TabsContent value="personal" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal information and contact details.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="Shad" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="CN" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="m@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          defaultValue="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

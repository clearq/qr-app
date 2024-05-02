import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Pages from "@/components/Pages"

export default function Home() {
  return (
    <>
    
      <Pages/>
    <div className="flex justify-center items-center mt-40">
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>VCard</CardTitle>
        <CardDescription>Create your VCard here</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="">
          <div className="grid grid-cols-2 w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">First Name*</Label>
              <Input id="firstName" placeholder="First Name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Last Name*</Label>
              <Input id="lastName" placeholder="Last Name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email*</Label>
              <Input id="email" placeholder="Email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Tel." />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="" />
            </div>
            {/* <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* <Button variant="outline">Cancel</Button> */}
        <Button>Save</Button>
      </CardFooter>
    </Card>
    </div>
    </>
  )
}

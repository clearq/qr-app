import React, { ChangeEvent, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { DropdownMenu } from './ui/dropdown-menu'
import { DropdownMenuContent, DropdownMenuTrigger } from './Dropdown'
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as yup from 'yup'

export const Vcard = () => {
    const { toast } = useToast();
  const router = useRouter();
  const [logo, setLogo] = useState<string | null>(null);


  const validation = useFormik({
    initialValues: {
      url: "",
      customerEmail: "",
      firstName: "",
      lastName: "",
      tag: "",
      phone: "",
      company: "",
      title: "",
      logoType: "",
      image: "",
      linkedIn: "",
      x: "",
      facebook: "",
      instagram: "",
      snapchat: "",
      tiktok: "",
    },
    validationSchema: yup.object({
      url: yup.string().url().nullable(),
      customerEmail: yup.string().email().required("Email is required"),
      firstName: yup.string().min(3).required("First name is required"),
      lastName: yup.string().min(3).required("Last name is required"),
      tag: yup.string().min(3).required("Label is required"),
      phone: yup.number().nullable(),
      company: yup.string().nullable(),
      image: yup.string().nullable(),
      title: yup.string(),
      logoType: yup.string().nullable(),
      linkedIn: yup.string().nullable(),
      x: yup.string().nullable(),
      facebook: yup.string().nullable(),
      instagram: yup.string().nullable(),
      snapchat: yup.string().nullable(),
      tiktok: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      fetch("/api/saveVcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.status === 201) {
            toast({
              title: `Created sucessfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });

            // Redirect to the dynamic page with the information
            router.replace(`/vcard/details?id=${data.id}`);
          } else {
            toast({
              variant: "destructive",
              title: `Error creating vCard`,
              description: `${new Date().toLocaleDateString()}`,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast({
            variant: "destructive",
            title: `Something went wrong`,
            description: `${new Date().toLocaleDateString()}`,
          });
        });
    },
  });

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const generateVCardString = (values: any) => {
    return `
BEGIN:VCARD
VERSION:3.0
N: ${values.firstName} ${values.lastName}
FN:${values.firstName} ${values.lastName}
EMAIL:${values.customerEmail}
TEL:${values.phone ?? ""}
ORG:${values.company ?? ""}
TITLE:${values.title ?? ""}
URL:${values.url ?? ""}
X-LINKEDIN:${values.linkedIn ?? ""}
X-TWITTER:${values.x ?? ""}
X-FACEBOOK:${values.facebook ?? ""}
X-INSTAGRAM:${values.instagram ?? ""}
X-SNAPCHAT:${values.snapchat ?? ""}
X-TIKTOK:${values.tiktok ?? ""}
END:VCARD
    `.trim();
  };

  const handleDownloadVcard = () => {
    const values = validation.values;
    const vCardData = generateVCardString(values);

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${values.firstName}_${values.lastName}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    const svg = document.getElementById("vcard-svg");
    if (!svg) {
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Check if context is null

    const img = document.createElement("img");

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = "vcard-svg.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const WIDTH = 300;
      const quality = 0.8; // Adjust quality as needed

      let imgObj = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(imgObj);

      reader.onload = (e) => {
        let imageUrl = e.target?.result;
        let image = document.createElement("img");
        //@ts-ignore
        image.src = imageUrl;

        image.onload = (e) => {
          let canvas = document.createElement("canvas");
          //@ts-ignore
          let ratio = WIDTH / e.target.width;
          canvas.width = WIDTH;
          //@ts-ignore
          canvas.height = e.target.height * ratio;
          const context = canvas.getContext("2d");
          //@ts-ignore
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              //@ts-ignore
              const new_image = URL.createObjectURL(blob);
              // Use new_image for your purposes (e.g., saving or displaying)
              validation.setFieldValue("image", new_image);
            },
            "image/jpeg",
            quality
          );
        };
      };
    }
  };

    const handleBrowseClick = () => {
        const input = document.getElementById("imageInput");
        if (input) {
          input.click();
        }
      };
  return (
    <>
    <Card className="mt-10">
          <CardHeader>
            <CardTitle>VCard</CardTitle>
            <CardDescription>Create your VCard here</CardDescription>
          </CardHeader>
          <label htmlFor="imageInput" style={{ cursor: "pointer" }}>
            <div className="flex flex-col justify-center items-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={validation.values.image} alt="User Image" />
                <AvatarFallback className="text-[3rem]">
                  {validation.values.firstName[0]}
                  {validation.values.lastName[0]}
                </AvatarFallback>
              </Avatar>
          <Button onClick={handleBrowseClick} className="mt-6">
                  Upload Image 📄
                </Button>
            </div>
            <input
              id="imageInput"
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </label>
          <CardContent>
            <form onSubmit={validation.handleSubmit} className="space-y-5 mt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">
                    First name <span className="text-xs text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={validation.values.firstName}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.firstName &&
                  validation.errors.firstName ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.firstName}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastName">
                    Last name <span className="text-xs text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={validation.values.lastName}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.lastName && validation.errors.lastName ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.lastName}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="customerEmail">
                    Email <span className="text-xs text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    name="customerEmail"
                    placeholder="example@gmail.com"
                    value={validation.values.customerEmail}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.customerEmail &&
                  validation.errors.customerEmail ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.customerEmail}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tag">
                    Label <span className="text-xs text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="tag"
                    placeholder="Tag"
                    value={validation.values.tag}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.tag && validation.errors.tag ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.tag}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    type="text"
                    name="phone"
                    placeholder="Tel."
                    value={validation.values.phone}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.phone && validation.errors.phone ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.phone}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={validation.values.company}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.company && validation.errors.company ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.company}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={validation.values.title}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.title && validation.errors.title ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.title}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="url">Website</Label>
                  <Input
                    type="url"
                    name="url"
                    placeholder="Website"
                    value={validation.values.url}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.url && validation.errors.url ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.url}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    type="url"
                    name="linkedIn"
                    placeholder="https://"
                    value={validation.values.linkedIn}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.linkedIn && validation.errors.linkedIn ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.linkedIn}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    type="url"
                    name="facebook"
                    placeholder="https://"
                    value={validation.values.facebook}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.facebook && validation.errors.facebook ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.facebook}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    type="url"
                    name="instagram"
                    placeholder="https://"
                    value={validation.values.instagram}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.instagram &&
                  validation.errors.instagram ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.instagram}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tiktok">Tiktok</Label>
                  <Input
                    type="url"
                    name="tiktok"
                    placeholder="https://"
                    value={validation.values.tiktok}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.tiktok && validation.errors.tiktok ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.tiktok}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="snapchat">Snapchat</Label>
                  <Input
                    type="url"
                    name="snapchat"
                    placeholder="https://"
                    value={validation.values.snapchat}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.snapchat && validation.errors.snapchat ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.snapchat}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="x">X</Label>
                  <Input
                    type="url"
                    name="x"
                    placeholder="https://"
                    value={validation.values.x}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.x && validation.errors.x ? (
                    <div className="text-xs text-red-500">
                      {validation.errors.x}
                    </div>
                  ) : null}
                </div>
               
              </div>
              <div className="flex flex-row mt-5">
                <Button className="flex mr-3" type="submit">
                  Create
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="">Download</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="flex flex-col mt-2"
                    align="end"
                  >
                    <Button
                      className="mb-2"
                      onClick={() => handleDownloadVcard()}
                    >
                      Download vCard
                    </Button>
                    <Button onClick={handleDownload}>VCard PNG</Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between"></CardFooter>
        </Card>
    </>
  )
}

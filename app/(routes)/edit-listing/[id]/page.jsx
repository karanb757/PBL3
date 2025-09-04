"use client";

import React, { useEffect, useState } from "react";
import FileUpload from  '../_components/FileUpload.jsx'
import { Label } from "../../../../@/components/ui/label.jsx";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../@/components/ui/radio-group.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../@/components/ui/select.jsx";
import { Button } from "../../../../components/ui/button.jsx";
import { useParams,usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "../../../../Utils/supabase/client.js";
import { useFormik } from "formik";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../@/components/ui/alert-dialog.jsx"



function EditListing() {
  
  const params = useParams();
  const id = params?.id;
  
  const inputClass ="border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500";
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Editing listing with ID:", params?.id);
  }, []);

  useEffect(() => {
    if (user) {
      verifyUserRecord();
    }
  }, [user]);

  const verifyUserRecord = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select("id, createdBy")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Listing not found");
      router.push("/");
      return;
    }

    if (data.createdBy !== user?.primaryEmailAddress.emailAddress) {
      toast.error("Unauthorized access: You can't edit this listing");
      router.push("/");
    }
  };

  const onSubmitHandler = async (formValue) => {
    setLoading(true);

    const {data,error} = await supabase
      .from("listing")
      .update(formValue)
      .eq("id", id)
      .select();

    if(data)
    {
      toast('Listing updated and Published');
      setLoading(false);
      console.log("Updating listing with:", {
        type: formValue.type,
        propertyType: formValue.propertyType,
        bedroom: formValue.bedroom,
        bathroom: formValue.bathroom,
        builtin: formValue.builtin,
        parking: formValue.parking,
        lotsize: formValue.lotsize,
        area: formValue.area,
        price: formValue.price,
        hoa: formValue.hoa,
        description: formValue.description,
        profileimage: formValue.profileimage,
        fullname: formValue.fullname
      });
    }

    for (const image of images) {
      setLoading(true);
      const file = image;
      const fileName = Date.now().toString();
      const fileExt = fileName.split('.').pop();

      const { data, error } = await supabase.storage
        .from('listingimages')
        .upload(`${fileName}`, file, {
          contentType:`image/${fileExt}`,
          upsert: false
        });

      if (error) 
      {
        setLoading(false);
        console.error("Upload error:", error.message);
        toast.error("Error while uploading images");
        return;
      }
          
      else 
      {

        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
        const { data, error } = await supabase
          .from("listingImages")
          .insert([
            { url: imageUrl, listing_id: id }
          ])
        .select();

        if(data)
        {
          setLoading(false);
        }

        if (error) 
        {
          setLoading(false);
        }
      }
    }
    setLoading(false);
  };

  const publishBtnHandler = async()=>{
    setLoading(true)
        const {data,error} = await supabase
        .from("listing")
        .update({active:true})
        .eq('id',params?.id)
        .select();

        if(data)
        {
          setLoading(false)
          toast('Listing Published! ')
        }
  }

  const formik = useFormik({
    initialValues: {
      type: "",
      propertyType: "",
      bedroom: "",
      bathroom: "",
      builtin: "",
      parking: "",
      lotsize: "",
      area: "",
      price: "",
      hoa: "",
      description: "",
      profileimage: user?.imageUrl,
      fullname: user?.fullName
    },
    onSubmit: (values) => {
      onSubmitHandler(values);
    },
  });

  return (
    <div className="px-10 md:px-56 my-10">
      <h2 className="font-bold text-2xl mt-60">
        Enter some more details about your listing
      </h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="p-8 rounded-lg shadow-md bg-white space-y-6">
          {/* Rent or Sell */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg text-slate-500">Do you want to Rent or Sell it?</h2>
            <RadioGroup
              defaultValue="Rent"
              className="flex gap-6"
              onValueChange={(v) => formik.setFieldValue("type", v)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sell" id="Sell" />
                <Label htmlFor="Sell">Sell</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Rent" id="Rent" />
                <Label htmlFor="Rent">Rent</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Property Type */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg text-slate-500">Property Type</h2>
            <Select
              onValueChange={(value) => formik.setFieldValue("propertyType", value)}
              name="propertyType"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Family House">Single Family House</SelectItem>
                <SelectItem value="Town House">Town House</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-500">Bedroom</h2>
              <input
                type="number"
                placeholder="Ex2"
                name="bedroom"
                className={inputClass}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-500">Bathroom</h2>
              <input
                type="number"
                placeholder="Ex2"
                name="bathroom"
                className={inputClass}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-500">Built In</h2>
              <input
                type="text"
                placeholder="Ex.1900 Sq.ft"
                name="builtin"
                className={inputClass}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-500">Parking</h2>
              <input
                type="text"
                placeholder="Ex.2"
                name="parking"
                className={inputClass}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-500">Lot Size (Sq.Ft)</h2>
              <input
                type="text"
                placeholder="Ex.3000"
                name="lotsize"
                className={inputClass}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-500">Area (Sq.Ft)</h2>
              <input
                type="text"
                placeholder="Ex.2500"
                name="area"
                className={inputClass}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-500">Selling Price ($)</h2>
              <input
                type="number"
                placeholder="400000"
                name="price"
                className={inputClass}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-500">HOA (Per Month) ($)</h2>
              <input
                type="number"
                placeholder="100"
                name="hoa"
                className={inputClass}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="text-gray-500">Description</h2>
            <textarea
              placeholder="Describe your property..."
              name="description"
              className={`${inputClass} h-28 resize-none`}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <h2 className="font-lg text-gray-500 my-2">Upload Property Images</h2>
            <FileUpload setImages={(value) => setImages(value)} />
          </div>

          {/* Buttons */}
          <div className="flex gap-7 justify-end">
          <Button type="submit" disabled={loading} variant="outline" className="text-[#7f57f1] border-[#7f57f1]">
          {loading ? <Loader className="animate-spin"/> : 'Save'}
          </Button>


            <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" disabled={loading} className="">
                {loading ? <Loader className="animate-spin"/> : 'Save & Publish'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ready To Publish</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you really want to publish the listing ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={publishBtnHandler}>
                  {loading?<Loader className="animate-spin "/>:'Countine'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          </div>
        </div>
      </form>
    </div>
  );
}

export default EditListing;
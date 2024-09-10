'use client'
import React, { useRef,useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  Upload,
} from "lucide-react"

import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

import { Textarea } from "../components/ui/textarea"

import { auth, firestore, storage } from "../firebase/clientApp";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  uploadBytes
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString,uploadBytesResumable } from "@firebase/storage";
import { useRouter } from 'next/navigation'

import { Center, Icon, useToast } from '@chakra-ui/react'
import { FaTrash } from 'react-icons/fa6'
import { Spinner } from 'flowbite-react'

export default function UploadInsights() {
  {/**BackEnd Code */}
  const [title,setTitle] = useState("");
    const [link,setLink] = useState("");
    const [author,setAuthor] = useState("");
    const [location,setLocation] = useState("");
    const [description,setDescription] = useState("");
    const [status,setStatus] = useState("");
    const [loading,setLoading] = useState(false)
    const router = useRouter();
  
    const filePickerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState([]);
    const toast = useToast(); 
    

 

  {/**Upload Data to firebase*/}
  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(
      collection(
        firestore,
        'Insights',
      ),
      {
        Title: title,
        Author: author,
        Description: description,
        Location: location,
        VideoLink:link,
        Status:status,
        timestamp: serverTimestamp(),
       
      }
    );

    const imageRef = ref(storage, `Insights/${docRef.id}/image`);

    if (selectedFile.length > 0) {
      await Promise.all(
        selectedFile.map(async (fileInfo, index) => {
          const { dataUrl, fileType } = fileInfo;
          const imageRef = ref(storage, `Insights/${docRef.id}/image${index}`);
          const imageBlob = await fetch(dataUrl).then((response) => response.blob());
          const uploadTask = uploadBytesResumable(imageRef, imageBlob);
          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                // Progress tracking logic if needed
              },
              reject, // Error handling
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                await updateDoc(doc(firestore, 'Insights', docRef.id), {
                  [`image${index}`]: {
                    downloadURL,
                    fileType,
                  },
                });
                resolve();
              }
            );
          });
        })
      )
        .then(() => {
          setLoading(false);
          toast({
            title: 'Insight uploaded successfully👍',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        })
        .catch((error) => {
          alert(error.message);
          setLoading(false);
          toast({
            title: 'Error uploading Insight',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        });
    }
    

    setLoading(false);
    setTitle("");
    setAuthor("");
    setLocation();
    setLink("");
    setStatus("");
    router.push('/InsightAdmin');
    
  };

  const addImageToPost = (e) => {
    const files = Array.from(e.target.files);
  
    Promise.all(
      files.map(async (file) => {
        const dataUrl = await readFileAsDataURL(file);
        const fileType = getFileTypeFromDataURL(dataUrl);
        return {
          dataUrl,
          fileType,
        };
      })
    )
      .then((dataUrls) => {
        setSelectedFile((prevSelectedFiles) => [...prevSelectedFiles, ...dataUrls]);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  
  
  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  
  const getFileTypeFromDataURL = (dataUrl) => {
    const arr = dataUrl.split(',');
    const match = arr[0].match(/:(.*?);/);
    if (match && match.length >= 2) {
      return match[1];
    }
    return null;
  };

  const handleDeleteImage = (index) => {
    setSelectedFile((prevSelectedFiles) => {
      const updatedFiles = [...prevSelectedFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  return (
    <form action='#'>
    <div className="flex min-h-screen w-full flex-col bg-muted/40">

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
    
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
         
            <div className="flex items-center gap-4">
            <Link href='/InsightAdmin'>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
               
                <span className="sr-only">Back</span>
             
              </Button>
              </Link>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              New  Insight
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                New
              </Badge>
          
              <div className="hidden items-center gap-2 md:ml-auto md:flex mb-3">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                {loading ? (
        <Center>    
            <button
        disabled
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
      >
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 mr-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Uploading Insight
      </button></Center>
      ) : (
              <Button onClick={sendPost}  type="submit" size="sm">Save Insight</Button>
            )}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Insight Details</CardTitle>
                    <CardDescription>
                      Fill up the insight details below, to add new insight
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Title</Label>
                        <Input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e)=>setTitle(e.target.value)}
                          className="w-full"
                          placeholder="Title Name"
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="name">Author</Label>
                        <Input
                          id="author"
                          value={author}
                         onChange={(e)=>setAuthor(e.target.value)}
                          type="text"
                          className="w-full"
                          placeholder="Author name"
                        />
                      </div>
                      
                      <div className="grid gap-3">
                        <Label htmlFor="name">Video Link</Label>
                        <Input
                          id="link"
                          type="text" value={link}
                          onChange={(e)=>setLink(e.target.value)}
                          className="w-full"
                          placeholder="Video Link"
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="name">Location</Label>
                        <Input
                          id="Location"
                          type="text"
                          className="w-full"
                          value={location}
                          onChange={(e)=>setLocation(e.target.value)}
                          placeholder="Insight Location"
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                          className="min-h-32"
                          value={description}
                          onChange={(e)=>setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              
           
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Insight Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select
                        value={status}
                        onValueChange={(value) => setStatus(value)} 
                        >
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent 
                          className='bg-gray-50'
                       
                          >
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Published">Active</SelectItem>
                           
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="overflow-hidden" x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Insight Images</CardTitle>
                    <CardDescription>
                      Add images to the insight
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                 
                      <div className="grid grid-cols-3 gap-2">
                      {selectedFile.map((file, index) => (
                        <button key={index}>
                          <Image
                           
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src={file.dataUrl} alt={`Image ${index}`} objectFit="contain"
                            width="84"
                          />
                          <Button onClick={() => handleDeleteImage(index)} mt={2} size="sm" colorScheme="gray">
                  <Icon as={FaTrash} color="red" />
                </Button>
                        </button>
                      ))}
                         <div>
      <input
        type="file"
        ref={filePickerRef}
        onChange={addImageToPost}
        multiple
        style={{ display: 'none' }}
      />
         <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mr-2"
                  onClick={() => filePickerRef.current.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
    </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
               
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              {loading ? (
        <Center>    
            <button
        disabled
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
      >
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 mr-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Uploading Insight
      </button></Center>
      ) : (
              <Button onClick={sendPost}  type="submit" size="sm">Save Insight</Button>
            )}
            </div>
           
          </div>
        </main>
      </div>
     
    </div>
    </form>
  )
}

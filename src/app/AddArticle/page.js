'use client'

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import {
  ChevronLeft,
  Upload,
  User,
} from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import Link from 'next/link';
import Image from 'next/image';
import { auth, firestore, storage } from "../../firebase/clientApp";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { FaTrash } from 'react-icons/fa6';
import { Spinner } from 'flowbite-react';
import { Center, Icon } from '@chakra-ui/react';

export default function Page() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const toast = useToast();

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(
      collection(firestore, 'Articles'),
      {
        Title: title,
        photoUrl: user.photoURL,
        email: user.email,
        name: user.displayName,
        Tags: tags.split(',').map((tag) => tag.trim()),
        Description: description,
        Featured: isFeatured,
        Category: category,
        timestamp: serverTimestamp(),
      }
    );

    if (selectedFile.length > 0) {
      await Promise.all(
        selectedFile.map(async (fileInfo, index) => {
          const { dataUrl, fileType } = fileInfo;
          const imageRef = ref(storage, `Articles/${docRef.id}/image${index}`);
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
                await updateDoc(doc(firestore, 'Articles', docRef.id), {
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
            title: 'Article uploaded successfully👍',
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
    setDescription("");
    setTags("");
    setIsFeatured(false);
    setCategory("");
    router.push('/AdminArticles');
  };

  const addImageToPost = (e) => {
    e.preventDefault();
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendPost();
      }}
    >
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <Link href='/AdminArticles'>
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Button>
                </Link>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  New Article
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
          Loading...
        </button>
                    </Center>
                  ) : (
                    <Button type="submit" size="sm">Save Article</Button>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Article Details</CardTitle>
                      <CardDescription>
                        Fill up the article details below, to add new article
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
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full"
                            placeholder="Article Title"
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Tags</Label>
                          <Input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            type="text"
                            className="w-full"
                            placeholder="Enter article tags (comma-separated)"
                          />
                        </div>
                        <div className="grid gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={isFeatured}
                              onCheckedChange={(checked) => setIsFeatured(!!checked)}
                              id="terms2"
                            />
                            <label
                              htmlFor="terms2"
                              className="text-sm font-medium leading-none"
                            >
                              Is it featured?
                            </label>
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                            className="min-h-32"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-3">
                    <CardHeader>
                      <CardTitle>Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="status">Choose Category</Label>
                          <Select
                            value={category}
                            onValueChange={(value) => setCategory(value)}
                          >
                            <SelectTrigger id="status" aria-label="Select status">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className='bg-gray-50'>
                              <SelectItem value="weather">Weather</SelectItem>
                              <SelectItem value="accidents">Accidents</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="health">Health</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                    <CardHeader>
                      <CardTitle>Article Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-3 gap-2">
                          {selectedFile.map((file, index) => (
                            <button key={index}>
                              <Image
                                className="aspect-square w-full rounded-md object-cover"
                                height="84"
                                src={file.dataUrl}
                                alt={`Image ${index}`}
                                objectFit="contain"
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
                            <button
                              className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                              onClick={(e) => {
                                e.preventDefault();
                                filePickerRef.current.click();
                              }}
                            >
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span className="sr-only">Upload</span>
                            </button>
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
          Loading...
        </button>
                  </Center>
                ) : (
                  <Button type="submit" size="sm">Save Article</Button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </form>
  );
}

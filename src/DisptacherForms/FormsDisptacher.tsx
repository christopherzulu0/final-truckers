'use client'
import React,{useEffect, useState} from 'react'

import Link from "next/link"
import {
  ChevronLeft,
  User,
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
import { Textarea } from "../components/ui/textarea"
import { useRouter } from "next/navigation"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { auth, firestore, storage } from "../firebase/clientApp"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { Center, useToast } from "@chakra-ui/react"
import { Spinner } from "flowbite-react"


interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
  email: string | null;
}

export default function Form() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [contact, setContact] = useState('');
    const [experience, setExperience] = useState('');
    const [description, setDescription] = useState('');
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [toastVisible, setToastVisible] = useState(false); // Toast visibility state
    const [toastMessage, setToastMessage] = useState(''); // Toast message state

   
    {/**Get user details */}
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch('/api/user');
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else if (response.status === 401) {
            console.warn('User is not authorized. Session might have expired.');
            // Handle unauthorized case here, e.g., redirect to login
          } else {
            console.error('Failed to fetch user:', response.status);
          }
        } catch (error) {
          console.error('An error occurred while fetching user:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchUser();
    }, []); 
  
  
    const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files && event.target.files[0];
      setCvFile(selectedFile);
    };
  
    const sendPost = async () => {
      if (loading) return;
      setLoading(true);
  
      if (!user) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }
  
      if (!user?.displayName || !user?.email) {
        console.error('Missing user information');
        setLoading(false);
        return;
      }
  
      try {
        const docRef = await addDoc(
          collection(firestore, 'Dispatchers'),
          {
            UID:user?.id,
            Name: user?.displayName,
            Email: user?.email,
            Photo: user?.avatarUrl,
            Status:'Pending',
            Contact: contact,
            Experience: experience,
            Description:description,
            timestamp: serverTimestamp(),
          }
        );
  
        if (cvFile) {
          const cvRef = ref(storage, `Dispatchers/${docRef.id}/cv`);
          await uploadBytes(cvRef, cvFile);
  
          const downloadURL = await getDownloadURL(cvRef);
          await updateDoc(doc(firestore, 'Dispatchers', docRef.id), {
            Cv: downloadURL,
          });
        }
  
        setContact('');
        setExperience('');
        setCvFile(null);
        setDescription('');

        setToastMessage('Subimtted successfully');
        setToastVisible(true);
    
        // Hide toast after 3 seconds
        setTimeout(() => {
          setToastVisible(false);
        }, 3000);

        
      } catch (error) {
        console.error('Error adding document: ', error);
  
          setToastMessage('Error submitting form');
          setToastVisible(true);

      } finally {
        setLoading(false);
        
      }
    };

    const Toast = ({ message, visible, onClose }) => {
      if (!visible) return null;
    
      return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
            <span className="mr-2">✅</span>
            <p>{message}</p>
            <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
              ✕
            </button>
          </div>
        </div>
      );
    };
  
    const closeToast = () => {
      setToastVisible(false);
    };


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
   <Toast message={toastMessage} visible={toastVisible} onClose={closeToast} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
             <Link href='/'>
             <Button
             
             variant="outline" size="icon" className="h-7 w-7">
               <ChevronLeft className="h-4 w-4" />
               <span className="sr-only">Back</span>
             </Button>
             </Link>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
               Dispatcher Form
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
              Get Started
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                {loading ? (
        <Center><Spinner color="gray.600" size="md" /></Center>
      ) : (
              <Button
              onClick={sendPost}
              type="submit"
              size="sm"
              disabled={!User || loading}
            >
              {loading ? 'Applying...' : 'Submit Form'}
            </Button>

            )}
              </div>
            </div>
            <div >
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Dispatcher Form</CardTitle>
                    <CardDescription>
                      To Get Started, Kindly fill up the dispatcher form.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                    
                      <div className="grid gap-3">
                        <Label htmlFor="name">Contact Number</Label>
                        <Input
                          id="contact number"
                          type="text"
                          className="w-full"
                          value={contact}
                          onChange={(e)=>setContact(e.target.value)}
                        />
                      </div>
                 
                      <div className="grid gap-3">
                        <Label htmlFor="name">Years of Experience</Label>
                        <Input
                          id="Years of Experience"
                          type="text"
                          className="w-full"
                          value={experience}
                          onChange={(e)=>setExperience(e.target.value)}
                        />
                        
                      </div>
               
                      <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e)=>setDescription(e.target.value)}
                          className="min-h-32"
                          placeholder='Tell Us about yourself'
                        />
                      </div>

                      <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="picture">Cv upload(*PDF only)</Label>
                      <Input
                       accept="application/pdf"
                       onChange={handleCvUpload}
                      type="file" />
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
        <Center><Spinner color="gray.600" size="md" /></Center>
      ) : (
              <Button
              onClick={sendPost}
              type="submit"
              size="sm"
              disabled={!User || loading}
            >
              {loading ? 'Applying...' : 'Submit Form'}
            </Button>

            )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,

} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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


import { useRouter } from "next/router"
import { useState } from "react"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { auth, firestore, storage } from "@/firebase/clientApp"
import { useAuthState } from "react-firebase-hooks/auth"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { Center, useToast } from "@chakra-ui/react"
import { Spinner } from "flowbite-react"

export default function WriterForm() {
  const [contact, setContact] = useState('');
  const [experience, setExperience] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, error] = useAuthState(auth);
  const toast = useToast(); 

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

    if (!user.displayName || !user.email) {
      console.error('Missing user information');
      setLoading(false);
      return;
    }

    try {
      const docRef = await addDoc(
        collection(firestore, 'Writers'),
        {
          UID:user.uid,
          Name: user.displayName,
          Email: user.email,
          Status:'Pending',
          Photo: user.photoURL,
          Contact: contact,
          Experience: experience,
          timestamp: serverTimestamp(),
        }
      );

      if (cvFile) {
        const cvRef = ref(storage, `Writers/${docRef.id}/cv`);
        await uploadBytes(cvRef, cvFile);

        const downloadURL = await getDownloadURL(cvRef);
        await updateDoc(doc(firestore, 'Writers', docRef.id), {
          Cv: downloadURL,
        });
      }

      setContact('');
      setExperience('');
      setCvFile(null);
    } catch (error) {
      console.error('Error adding document: ', error);
      toast({
        title: 'Error submitting a form',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoading(false);
      toast({
        title: 'Your form has been submitted successfully👍',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }

    
  };



      
     
    const router = useRouter();
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
   
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
              Writer Application Form
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
              Get Started
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
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
              
              <Button
              onClick={sendPost}
              type="submit"
              size="sm"
              disabled={!user || loading}
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
                    <CardTitle>Writer Application Form</CardTitle>
                    <CardDescription>
                      To become a writer, Kindly fill up the writer application form.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                    
                      <div className="grid gap-3">
                        <Label htmlFor="name">Contact Number</Label>
                        <Input
                          
                          type="number"
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
              <Button
              onClick={sendPost}
              type="submit"
              size="sm"
              disabled={!user || loading}
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

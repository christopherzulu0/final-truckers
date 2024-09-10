'use client'
import React, { useRef,useState } from 'react'
import Link from "next/link"
import {
  ChevronLeft,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react"

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
import { auth, firestore, storage } from "../firebase/clientApp";
import {
  addDoc,
  collection,
  serverTimestamp,
 
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString,uploadBytesResumable } from "@firebase/storage";
import { useRouter } from 'next/navigation'
import { Center, Icon, useToast } from '@chakra-ui/react'


export default function NewTrip() {
  {/**BackEnd Code */}
  const [date,setDate] = useState("");
    const [Duration,setDuration] = useState("");
    const [TripName,setTripName] = useState("");
    const [DistanceTravelled,setDistanceTravelled] = useState("");
    const [CargoDetails,setCargoDetails] = useState("");
    const [Notes,setNotes] = useState("");
    const [status,setStatus] = useState("");
    const [loading,setLoading] = useState(false)
    const router = useRouter();
   
    const filePickerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState([]);
    const toast = useToast(); 
    

 

  {/**Upload Data to firebase*/}
  const sendPost = async ({id}) => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(
      collection(
        firestore,
        'DriverTrips'
      ),
      {
        UID: user.uid,
        Date: date,
        TripName: TripName,
        Notes: Notes,
        Distance: DistanceTravelled,
        Duration:Duration,
        Cargo:CargoDetails,
        timestamp: serverTimestamp(),
       
      }
    );

  
    

    setLoading(false);
    setDate("");
    setTripName("");
    setDistanceTravelled();
    setDuration("");
    setCargoDetails("");
    setNotes("");
    router.push('/DriverBoard');
    
  };

  







  


  return (
<form action='#'>
  <div className="flex min-h-screen w-full max-w-[40rem] flex-col bg-muted/40 mx-auto px-4 sm:px-6 lg:px-8">
    
    <div className="flex flex-col sm:gap-4 sm:py-4">
      
      <main className="grid flex-1 items-start gap-4 py-4 sm:py-0 md:gap-8">
        
        <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
          
          <div className="flex items-center gap-4">
            <Link href='/DriverAccess'>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              New Trip
            </h1>
            
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
                <Button onClick={sendPost} type="submit" size="sm">Save Trip</Button>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Last Trip Details</CardTitle>
                  <CardDescription>
                    Add details for your previous trip.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        type="date"
                        value={date}
                        onChange={(e)=>setDate(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="tripName">Trip Name</Label>
                      <Input
                        value={TripName}
                        onChange={(e)=>setTripName(e.target.value)}
                        type="text"
                        className="w-full"
                        placeholder="Trip name"
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="duration">Trip Duration</Label>
                      <Input
                        type="text" 
                        value={Duration}
                        onChange={(e)=>setDuration(e.target.value)}
                        className="w-full"
                        placeholder="Trip Duration"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="distance">Distance Travelled</Label>
                      <Input
                        type="text"
                        className="w-full"
                        value={DistanceTravelled}
                        onChange={(e)=>setDistanceTravelled(e.target.value)}
                        placeholder="Distance Travelled"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="cargoDetails">Cargo Details</Label>
                      <Input
                        type="text"
                        className="w-full"
                        value={CargoDetails}
                        onChange={(e)=>setCargoDetails(e.target.value)}
                        placeholder="Cargo Name"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="notes">Trip Notes</Label>
                      <Textarea
                        placeholder="Add trip notes"
                        className="min-h-32"
                        value={Notes}
                        onChange={(e)=>setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 md:hidden">
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
              <Button onClick={sendPost} type="submit" size="sm">Save Trip</Button>
            )}
          </div>
        </div>
      </main>
    </div>
  </div>
</form>

  )
}

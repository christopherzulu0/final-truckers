'use client'

import React,{useEffect, useState} from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Briefcase,
  ChevronLeft,
  Home,
  LineChart,
  MapPin,
  Package,
  Package2,
  PanelLeft,
  Phone,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Upload,
  User,
  Users2,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Center, useToast } from "@chakra-ui/react"
import { Progress, Spinner } from "flowbite-react"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { auth, firestore, storage } from "../firebase/clientApp"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { Separator } from '@radix-ui/react-select';


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
  const [contact, setContact] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [Location, setLocation] = useState('');
  const [CompanyName, setCompanyName] = useState('');
  const [VehicleName,setVehicleName] =useState('')
  const [Trailer, setTrailer] = useState('');
  const [LicensePlate, setLicensePlate] = useState('');
  const [MountainExprience, setMountainExprience] = useState('');
  const [OffRoadExperience, setOffRoadExperience] = useState('');
  const [IceRoad, setIceRoad] = useState('');
  const [TransmissionType, setTransmissionType] = useState('');
  const [DriverRole, setDriverRole] = useState('');
  const [formProgress, setFormProgress] = useState(0);
  const [toastVisible, setToastVisible] = useState(false); // Toast visibility state
  const [toastMessage, setToastMessage] = useState(''); // Toast message state
  const [user, setUser] = useState<User | null>(null);

  const toast = useToast(); 
  
 console.log("Email:",user?.email)
 console.log("Name:",user?.displayName)
 console.log("photo:",user?.avatarUrl)
  {/**Fetch user details */}
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
  {/**End of fetch user details */}

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setCvFile(selectedFile);
  };

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    if (!User) {
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
        collection(firestore, 'Drivers'),
        {
          UID:user?.id,
          Name: user?.displayName,
          Email: user?.email,
          Photo: user?.avatarUrl,
          Contact: contact,
          Experience: experience,
          Description:description,
          Status:'Pending',
          Location:Location,
          VehicleName:VehicleName,
          Company:CompanyName,
          Trailers:Trailer,
          LicensePlate:LicensePlate,
          MountainExprience:MountainExprience,
          OffRoadExperience:OffRoadExperience,
          IceRoadExperience:IceRoad,
          Transmission: TransmissionType,
          Role:DriverRole,
          timestamp: serverTimestamp(),
        }
      );

      if (cvFile) {
        const cvRef = ref(storage, `Drivers/${docRef.id}/cv`);
        await uploadBytes(cvRef, cvFile);

        const downloadURL = await getDownloadURL(cvRef);
        await updateDoc(doc(firestore, 'Drivers', docRef.id), {
          Cv: downloadURL,
        });
      }

      setContact('');
      setExperience('');
      setCvFile(null);
      setDescription('');
      setLocation('');
      setCompanyName('');
      setTrailer('');
      setLicensePlate('');
      setMountainExprience('');
      setOffRoadExperience('');
      setIceRoad('');
      setTransmissionType('');
      setVehicleName("");
      setDriverRole('');


      setToastMessage('Form submitted successfully');
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


  {/**Calculate from progress */}
  const calculateProgress = () => {
    const fields = [
      Location, contact, CompanyName, experience, VehicleName, 
      LicensePlate, TransmissionType, DriverRole, description
    ];
    const filledFields = fields.filter(field => field !== '').length;
    const progress = (filledFields / fields.length) * 100;
    return Math.round(progress);
  };

  useEffect(() => {
    const newProgress = calculateProgress();
    setFormProgress(newProgress);
  }, [Location, contact, CompanyName, experience, VehicleName, LicensePlate, TransmissionType, DriverRole, description]);



  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
        <Toast message={toastMessage} visible={toastVisible} onClose={closeToast} />
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href='/'>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold">Driver  Form</CardTitle>
           
          </div>
          <CardDescription>Fill out the details to apply as a driver</CardDescription>
        </CardHeader>
        <CardContent>
         
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 ">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="experience" className='ml-3'>Experience</TabsTrigger>
                <TabsTrigger value="vehicle">Vehicle </TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Input 
                      type='text'
                      placeholder="Location"
                      className="pl-10"
                      value={Location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setFormProgress(calculateProgress());
                      }}
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <div className="relative">
                    <Input 
                      type='number'
                      placeholder="Contact Number"
                      className="pl-10"
                      value={contact}
                          onChange={(e)=>setContact(e.target.value)}
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <div className="relative">
                    <Input 
                      type='text'
                      placeholder="Company Name"
                      className="pl-10"
                      value={CompanyName}
                      onChange={(e)=>setCompanyName(e.target.value)}
                    />
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="experience">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input placeholder="Driving Experience (years)"
                    type='text' 
                   value={experience}
                   onChange={(e)=>setExperience(e.target.value)}
                  />
                  <Input placeholder="Mountain Experience (optional)"
                    type='text'
                   value={MountainExprience}
                   onChange={(e)=>setMountainExprience(e.target.value)}
                  />
                  <Input placeholder="Off-Road Experience (optional)"
                    type='text'
                   value={OffRoadExperience}
                   onChange={(e)=>setOffRoadExperience(e.target.value)}
                  />
                  <Input placeholder="Ice-Road Experience (optional)"
                    type='text'
                   value={IceRoad}
                   onChange={(e)=>setIceRoad(e.target.value)}
                  />
                  <Input placeholder="How many trailers(optional)"
                    type='text'
                   value={Trailer}
                   onChange={(e)=>setTrailer(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="vehicle">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Input 
                      type='text'
                      placeholder="Vehicle Name"
                      className="pl-10"
                      value={VehicleName}
                      onChange={(e)=>setVehicleName(e.target.value)}
                    />
                    <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <Input placeholder="License Plate"
                  type='text'
                   value={LicensePlate}
                   onChange={(e)=>setLicensePlate(e.target.value)}
                  />
                  <Select
                  value={TransmissionType}
                  onValueChange={(value)=>setTransmissionType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Transmission Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                   value={DriverRole}
                   onValueChange={(value)=>setDriverRole(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Driver Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4 Wheeler">4 Wheeler</SelectItem>
                      <SelectItem value="18 Wheeler">18 Wheeler</SelectItem>
                      <SelectItem value="Carrier">Carrier</SelectItem>
                      <SelectItem value="Despatcher">Despatcher</SelectItem>
                      <SelectItem value="Mechanic">Mechanic</SelectItem>
                      <SelectItem value="Safety Officer">Safety Officer</SelectItem>
                      <SelectItem value="Shipper">Shipper</SelectItem>
                    </SelectContent>
                  </Select>
                  
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="space-y-4">
              <Textarea 
                placeholder="Tell us about yourself"
                className='mb-5'
                value={description}
                          onChange={(e)=>setDescription(e.target.value)}
              />
              <Label htmlFor="cv-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors duration-300">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <span className="mt-2 block text-sm font-medium">
                    Upload your CV (PDF only)
                  </span>
                </div>
                <Input id="cv-upload" type="file" accept=".pdf" className="hidden" onChange={handleCvUpload} />
                
              </Label>
              {cvFile && <p className="text-sm text-muted-foreground mt-2">File uploaded: {cvFile.name}</p>}
            </div>

            <Collapsible className="mt-4">
              <CollapsibleTrigger className="text-sm text-muted-foreground hover:underline">
                What is Ice-Road Experience?
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 text-sm text-muted-foreground ">
                Ice-Road Experience refers to the driver's familiarity and skill in navigating roads covered in ice,
                often found in extreme cold climates. This experience is valuable for certain trucking routes.
              </CollapsibleContent>
            </Collapsible>

            <Progress value={formProgress} color={formProgress === 100 ? "success" : "primary"} className="w-full mt-6" />
        
        </CardContent>
        <CardFooter>
        <Button 
    type="submit" 
    onClick={sendPost}
    disabled={loading}
    className={`w-full p-2 rounded-full ${loading ? 'bg-blue-800' : 'bg-green-500'} text-white`}
  >
    {loading ? 'Submitting your application...' : 'Submit'}
  </Button>
        </CardFooter>
      </Card>
    </div>

  </div>

  )
}

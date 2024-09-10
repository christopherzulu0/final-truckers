'use client'
import React,{useState,useEffect, useRef} from "react"
import {
    Text,
    Card,
    CardHeader,
    Heading,
    CardBody,
    Box,
    Flex,
    Button,
    Spacer,
    Select,
    Link,
    Image,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Textarea,
    useToast ,
    useColorModeValue,
    Grid,
    Center,
    Icon,
    FormHelperText,
    Spinner,
    VStack,
    Badge,
  } from "@chakra-ui/react";
  import { InfoIcon, InfoOutlineIcon } from "@chakra-ui/icons";

  import { auth, firestore, storage } from "../../firebase/clientApp";
  import {
    addDoc,
    collection,
    doc,
    query,
    where,
    serverTimestamp,
    updateDoc,
    uploadBytes,
    getFirestore, 
    onSnapshot,
    Timestamp
  } from "@firebase/firestore";
  import { getDownloadURL, ref, uploadString,uploadBytesResumable } from "@firebase/storage";

import { FaImages, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";


interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
  email: string | null;
 
}


export default function LoadUpload() {
  const [Drivers, setDrivers] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false); // State to track authorization
    const [LoadName,setLoadName] = useState("");
    const [weight,setWeight] = useState("");
    const [straps,setStraps] = useState("");
    const [chains,setChains] = useState("");
    const [description,setDescription] = useState("");
    const filePickerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState([]);
    const toast = useToast(); 
    const [loading,setLoading] = useState(false);
    const router = useRouter();
    const [driverload,setDriverLoad] = useState([]);
    const [communityload,setCommunityLoad] = useState([]);
    const [toastVisible, setToastVisible] = useState(false); // Toast visibility state
    const [toastMessage, setToastMessage] = useState(''); // Toast message state


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
 


    const sendLoad = async () => {
        if (loading) return;
        setLoading(true);
      
        try {
          const commonData = {
            UID: user?.id,
            Load: LoadName,
            Weight: weight,
            Description: description,
            Straps: straps,
            Chains: chains,
            timestamp: serverTimestamp(),
          };
      
          // Insert into the first collection
          const docRef1 = await addDoc(
            collection(firestore, 'TruckLoad'),
            commonData
          );
      
        
      
          console.log('docRef1:', docRef1.id);
         
      
          // Uploading images to Firebase Storage for both documents
          if (selectedFile.length > 0) {
            const imagePromises = selectedFile.map(async (fileInfo, index) => {
              const { dataUrl } = fileInfo;
              const imageBlob = await fetch(dataUrl).then((response) =>
                response.blob()
              );
      
              console.log('Uploading image', index);
      
              // Upload image to the first collection
              const imageRef1 = ref(
                storage,
                `TruckLoad/${docRef1.id}/image${index}`
              );
              console.log('Uploading to imageRef1:', imageRef1.fullPath);
              const uploadTask1 = uploadBytesResumable(imageRef1, imageBlob);
              await uploadTask1;
              const downloadURL1 = await getDownloadURL(uploadTask1.snapshot.ref);
      
              // Upload image to the second collection
           
        
  
      
              return {
                downloadURL1,
               
              };
            });
      
            const uploadedImages = await Promise.all(imagePromises);
      
            // Update both collection documents with image URLs
            await updateDoc(doc(firestore, 'TruckLoad', docRef1.id), {
              images: uploadedImages.map((image) => image.downloadURL1),
            });
      
           
          }
      
          setLoading(false);
          setWeight('');
          setChains('');
          setLoadName('');
          setStraps('');
          setDescription('');

          setToastMessage('Load uploaded successfully');
          setToastVisible(true);
      
          // Hide toast after 3 seconds
          setTimeout(() => {
            setToastVisible(false);
          }, 3000);
      
         
          router.push('/DriverAccess');
        }catch (error) {
          console.error('Error adding document: ', error);
          setToastMessage('Error submitting form');
          setToastVisible(true);
        } finally {
          setLoading(false);
         
        }
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


    {/**Check if user exists in Driver collection and is approved */}
    useEffect(() => {
      if (!user?.id) {
        console.error('User ID is not available');
        return;
      }
  
    
      const writersCollection = collection(firestore, 'Drivers');
      const q = query(writersCollection,
        where('UID', '==', user?.id),
        where('Status', '==', 'Approved')
        );
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedInsightData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
  
        setDrivers(updatedInsightData);
  
        // Check if the user has the required permissions
        setIsAuthorized(updatedInsightData.length > 0); // Example condition, adjust as needed
      }, (error) => {
        console.error('Error fetching data:', error);
      });
  
      return () => {
        unsubscribe();
      };
    }, [user]);
  
    if (!user) {
      return <Center height="100vh">
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
        Checking Driver Info...
      </button>
    </Center>; // Or a loading spinner if you prefer
    }
  
    if (!isAuthorized) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <div className="relative p-4 w-full max-w-md h-full md:h-auto mx-auto">
            <div className="relative p-6 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800 sm:p-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Unauthorized Access</h3>
              <p className="mb-6 text-gray-500 dark:text-gray-300">
                You do not have the necessary permissions to access this page. Please contact your administrator if you believe this is a mistake.
              </p>
            </div>
          </div>
        </div>
      );
    }


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
    <>
<div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
<Toast message={toastMessage} visible={toastVisible} onClose={closeToast} />
  <div className="relative py-3 sm:max-w-xl sm:mx-auto">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
      <div className="max-w-md mx-auto">
        <div>
          <h1 className="text-2xl font-semibold text-center text-gray-900">Truck Load</h1>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <div className="flex items-center bg-blue-50 p-4 rounded-lg mb-6">
              <InfoIcon className="text-blue-500 w-6 h-6 mr-3" />
              <p className="text-sm text-blue-700">
                Upload Cargo details, you have loaded.
              </p>
            </div>

            <div className="space-y-4">
            <div>
        <label htmlFor="loadName" className="block mb-2 font-medium">Load Name</label>
        <input 
          id="loadName"
          value={LoadName}
          onChange={(e) => setLoadName(e.target.value)}
          placeholder="Load Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight</label>
                <select
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Choose the number of tons</option>
                  <option value="10 Tons">10 Tons</option>
                  <option value="50 Tons">50 Tons</option>
                  <option value="100 Tons">100 Tons</option>
                </select>
              </div>

              <div>
                <label htmlFor="straps" className="block text-sm font-medium text-gray-700">Straps</label>
                <select
                  id="straps"
                  value={straps}
                  onChange={(e) => setStraps(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Choose the number of straps</option>
                  <option value="1">1</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                </select>
              </div>

              <div>
                <label htmlFor="chains" className="block text-sm font-medium text-gray-700">Chains</label>
                <select
                  id="chains"
                  value={chains}
                  onChange={(e) => setChains(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Choose the number of chains</option>
                  <option value="1">1</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Selected Images</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedFile.map((file, index) => (
                    <div key={index} className="relative">
                      <img src={file.dataUrl} alt={`Image ${index}`} className="object-cover h-24 w-full rounded-md" />
                      <button onClick={() => handleDeleteImage(index)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md">
                        <FaTrash className="text-red-500 w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div 
                  onClick={() => filePickerRef.current.click()}
                  className="mt-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-blue-500 transition-colors duration-300"
                >
                  <div className="space-y-1 text-center">
                    <FaImages className="mx-auto text-gray-400 w-12 h-12" />
                    <p className="text-sm text-gray-600">Click to add more images</p>
                  </div>
                  <input
                    type="file"
                    ref={filePickerRef}
                    onChange={addImageToPost}
                    multiple
                    className="hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Here is a sample placeholder"
                  rows="3"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="pt-5">
                <button 
                  onClick={async () => {
                    await sendLoad();
                  }}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Spinner className="w-5 h-5" /> : 'Submit Load'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </>
  )
}

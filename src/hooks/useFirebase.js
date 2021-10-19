import { useEffect, useState } from "react"
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword,updateProfile} from "firebase/auth";
import initAuth from "../firebase/firebase.init";

initAuth()

const useFirebase=()=>{
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const [error, setError]=useState('');
  const [user, setUser]= useState({})
  const [name, setName] = useState('');
  const [isLoading, setIsLoading]=useState(true);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const signWithGoogle=()=>{
    setIsLoading(true);
   return signInWithPopup(auth, googleProvider)
  
  }
  
  const reload=()=>{
    window.location.reload()
  }


  const logOut=()=>{
    setIsLoading(true)
    signOut(auth)
    .then(() => {
     setUser({})
    })
    .finally(()=> setIsLoading(false));
    
  }

  //handle name
  const handleNameChange=event=>{
    setName(event.target.value)
  }

//handle email
  const handleEmailChange=event=>{
   setEmail(event.target.value);
  }

//handle password
  const handlePasswordChange=event=>{
    setPassword(event.target.value);
  }

  //set name

  const setUserName= ()=>{
    updateProfile(auth.currentUser, {
      displayName: name})
    .then(() => { 

    }).catch((error) => {
      
    });
  }


//handle registration

  const handleRegister=event=>{
    event.preventDefault();
    if(password.length<6){
      setError('Password must should be at least 6 character')
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
  .then(result => {
   
    const user = result.user;
    console.log(user);
    reload();
    setError('')
    setUserName();
  })
  .catch((error) => {
    const errorCode = error.code;
    setError(errorCode)
    // ..
  });
    
  }






  const handleEmailLog=()=>{
    signInWithEmailAndPassword(auth, email, password)
  .then((result) => {
    const user = result.user;
    console.log(user);
   setUser(user);
     
  })
  .catch((err) => setError(err.message));
  }


  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user) 
      } 
      setIsLoading(false)
    });
  },[])




return {
  name,
  isLoading,
  setIsLoading,
  handleNameChange,
  handleEmailLog,
  error,
  handleRegister,
  handleEmailChange,
  handlePasswordChange,
  user,
  signWithGoogle,
logOut
}

}
export default useFirebase;

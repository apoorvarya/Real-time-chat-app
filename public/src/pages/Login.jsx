import React,{useState,useEffect} from 'react'
// The useState hook allows you to add state to functional components. It returns a pair of values: the current state value and a function to update that state
// The useEffect hook allows you to perform side effects in functional components, such as fetching data, subscribing to events, or updating the DOM.
import styled from 'styled-components';
import {Link,useNavigate} from 'react-router-dom' // To link another route
import Logo from '../assets/logo.svg'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// toast notifications
import axios from 'axios';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { loginRoute } from '../utils/APIRoutes';

const Login = () => {
  const navigate=useNavigate();

  const [values,setValues]=useState({
      username: "",
      password: "",
  });
  const toastOptions={
    position: "bottom-right",
    autoClose:8000,
    pauseOnHover:true,
    draggable:true,
    theme:"dark"
  }
  useEffect(()=>{
      if(localStorage.getItem('chat-app-user')){
        navigate("/");
      }
  },[]);

  const handleChange=(event)=>{
    setValues({...values, [event.target.name]: event.target.value});
  }

  const handleValidation=()=>{
    const {password, username} =values;
    if(password===""){
        toast.error("Email and Password is required.",
            toastOptions
        );
        return false;
    }else if(username===""){
        toast.error("Email and Password is required.",toastOptions);
        return false;
    }
    return true;
  }



  const handleSubmit = async  (event)=>{
        event.preventDefault();
        // alert("form")
        if(handleValidation()){
            const {password, username} =values;
            const {data}=await axios.post(loginRoute,{
                username,
                password,
            });
            if(data.status===false){
              console.log(data.msg);
              toast.error(data.msg,toastOptions);
            }
            if(data.status===true){
              localStorage.setItem("chat-app-user",JSON.stringify(data.user));
              navigate("/");
            }
        }
    };

  return (
    <>
    <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
            <div className='brand'>
                <img src={Logo} alt='Logo' className="logo-spin"/>
                <h1>snappy</h1>
            </div>
            <input type="text" name="username" placeholder="Username" onChange={e=>handleChange(e)} min="3" />
            <input type="password" name="password" placeholder="Password" onChange={e=>handleChange(e)} />
            
            <button type="submit" className='btn' >Login</button>
            <SocialLoginButtons />
            <span>Don't have an account ? <Link to="/register">Register</Link> </span>
        </form>
    </FormContainer>
    <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    
    h1 {
      color: white;
      text-transform: uppercase;
    }

  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  .btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
export default Login
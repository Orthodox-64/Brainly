import { ReactElement } from "react";
type Variants="primary" | "secondary";

interface ButtonProps{
    variant :Variants;
    size:"sm"|"md"|"lg";
    text:string;
    startIcon?:ReactElement;
    endIcon?:ReactElement;
    onClick:()=>void;
}

const variantStyles={
     "primary":"bg-purple-600 text-white",
     "secondary":"bg-purple-300 text-purple-600"
}

const sizeStyles={
      "sm":"py-2 px-1 text-sm rounded-sm",
      "md":"py-2 px-4 text-md rounded-md",
      "lg":"py-4 px-8 text-xl rounded-xl"
}

const defaultStyles="rounded-md flex "

let firstName="Sachin";
let lastName="Pangal";

// let fullName=firstName+lastName;
let fullName=`${firstName} ${lastName}`;


export const Button=(props:ButtonProps)=>{
       return <button className={`${variantStyles[props.variant]} ${defaultStyles} ${sizeStyles[props.size]}`} >
        {props.startIcon ? <div className="pr-2">{props.startIcon}</div>:null}{props.text}{props.endIcon}</button>
}

<Button variant="primary" size="md" onClick={()=>{}} text={"Add"}></Button>
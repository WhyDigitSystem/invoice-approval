import React from "react";
import { FaCheck } from "react-icons/fa";
import "./Test.css";

const cards = [
    { id: 1, color: "bg-green-500", numberColor: "text-green-700" },
    { id: 2, color: "bg-blue-500", numberColor: "text-blue-700" },
    { id: 3, color: "bg-orange-500", numberColor: "text-orange-700" },
    { id: 4, color: "bg-pink-500", numberColor: "text-pink-700" },
  ];
  

const Test = () => {
  return (
    
    
    
    <div >
        <br/>
        <br/>
    <div class="flexbox">
        
    {/* <div class="flexcard flexcardGreen">
        
        <div class="flex flexcardTitle">Title</div>
        <div class="flex flexcardText">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Recusandae,
            temporibus consectetur? Iure id nam fuga asperiores repellat accusantium exercitationem nemo? </div>
        
    </div>

     
    <div class="flexcard flexcardNumberBlue">
        <div class="flex flexcardTitle">Title</div>
        <div class="flex flexcardText">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Recusandae,
            temporibus consectetur? Iure id nam fuga asperiores repellat accusantium exercitationem nemo? </div>
        
    </div> */}




    
</div>   

<div class="container">
     <div class="card">
       <div class="face face1">
         <div class="content">
            <i class="fab fa-windows"></i>            
           <h3>Windows</h3>
         </div>
       </div>
       <div class="face face2">
         <div class="content">
           <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ab repudiandae, explicabo voluptate et hic cum ratione a. Officia delectus illum perferendis maiores quia molestias vitae fugiat aspernatur alias corporis?</p>
           <a href="#" type="button">Read More</a>
         </div>
       </div>
    </div>
    
    <div class="card">
       <div class="face face1">
         <div class="content">
      <i class="fab fa-android"></i>               <h3>Android</h3>
         </div>
       </div>
       <div class="face face2">
         <div class="content">
           <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ab repudiandae, explicabo voluptate et hic cum ratione a. Officia delectus illum perferendis maiores quia molestias vitae fugiat aspernatur alias corporis?</p>
           <a href="#" type="button">Read More</a>
         </div>
       </div>
    </div>
    
    
    <div class="card">
       <div class="face face1">
         <div class="content">
           <i class="fab fa-apple"></i>
            <h3>Apple</h3>
         </div>
       </div>
       <div class="face face2">
         <div class="content">
           <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ab repudiandae, explicabo voluptate et hic cum ratione a. Officia delectus illum perferendis maiores quia molestias vitae fugiat aspernatur alias corporis?</p>
           <a href="#" type="button">Read More</a>
         </div>
       </div>
    </div>
    
    

    <div class="card">
       <div class="face face1">
         <div class="content">
           <i class="fab fa-apple"></i>
            <h3>Orange</h3>
         </div>
       </div>
       <div class="face face2">
         <div class="content">
           <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ab repudiandae, explicabo voluptate et hic cum ratione a. Officia delectus illum perferendis maiores quia molestias vitae fugiat aspernatur alias corporis?</p>
           <a href="#" type="button">Read More</a>
         </div>
       </div>
    </div>
    
    
    
    
    
  </div>
</div>


    
    
  );
};

export default Test;
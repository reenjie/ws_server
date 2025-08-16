import React, { useState } from "react";
import Data from "./Data";
import {ChatBox} from "./ChatBox";

const App = () => {
            return (
                        <>
                                    <div style={{
                                        position:"absolute",
                                        top:"50%",
                                        left:"50%",
                                        transform: "translate(-50%, -50%)"
                                    }}>
                        
                                               <ChatBox/>
                                         
                                    </div>
                        </>
            );
};
export default App;

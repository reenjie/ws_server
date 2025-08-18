import React, { useState } from "react";
import Data from "./Data";
import {ChatBox} from "./ChatBox";
import ChatApp from "./ChatApp";

const App = () => {
            return (
                        <>
                                    <div style={{
                                        position:"absolute",
                                        top:"50%",
                                        left:"50%",
                                        transform: "translate(-50%, -50%)"
                                    }}>
                        
                                               <ChatApp/>
                                         
                                    </div>
                        </>
            );
};
export default App;

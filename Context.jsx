import { createContext, useState } from "react";
import PropTypes from 'prop-types';
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState(""); {/*use to save the input data*/ }
    const [recentPrompt, setRecentPrompt] = useState(""); {/*use to save the recent prompt when entered the send button and display it on the main component*/ }
    const [prevPrompts, setPrevPrompts] = useState([]); {/*declared as an array and use to save the prev prompts on the recent tab in sidebar*/ }
    const [showResults, setShowResults] = useState(false); {/*a boolean type and once it is true it will hide the grid text in the boxes and display the result*/ }
    const [loading, setLoading] = useState(false); {/*once it is true, it will show the loading animation and after getting the data it become false*/ }
    const [resultData, setResultData] = useState(""); {/*display the result on our web page*/ }

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 * index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResults(false)
    }

    const onSent = async (prompt) => {

        setResultData("")
        setLoading(true)
        setShowResults(true)
        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt);
            setRecentPrompt(prompt)
        } else {
            setPrevPrompts(prev => [...prev, input])
            setRecentPrompt(input)
            response = await runChat(input)
        }
        let responseArray = response.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ")
        }
        setLoading(false)
        setInput("")
    }
    {/*response for the input will be stored in the response variable*/ }

    {/*these can be setter values can be accessed in main component and side bar component */ }
    const contextValue = {
        input,
        setInput,
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResults,
        setShowResults,
        loading,
        setLoading,
        resultData,
        setResultData,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ContextProvider

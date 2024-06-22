import Input from "./Input"
import Div from "../Div.jsx"

export default function UserInput({userInputInfo, userInput, onChangeInputValue}){
    // const[userInput, setUserInput] = useState({
    //     initalInvestment: 10000,
    //     annualInvestment: 1200,
    //     expectedReturn: 6,
    //     duration: 10
    // });
    let userInputFirstGroupInfo = [userInputInfo[0], userInputInfo[1]];
    let userInputSecondGroupInfo = [userInputInfo[1], userInputInfo[2]];
    // function handleChange(inputIdentifier, newValue){
    //     setUserInput(preUserInput=>{
    //         return {
    //             ...preUserInput,
    //             [inputIdentifier]: newValue,
    //         };
    //     });
    //     console.log(userInput)
    // }
    return (
        <section id="user-input">
        <Div className="input-group">
            {
                userInputFirstGroupInfo.map(
                    (info, index)=> {
                        let title = info.title;
                        let identifier = info.identifier;
                        let intialValue = userInput[info.identifier];

                        return (
                            <Input 
                                key={index} 
                                title={title} 
                                identifier={identifier} 
                                intialValue={intialValue} 
                                onChangeInputValue={onChangeInputValue}
                            />
                        )
                    }
                )
            }
        </Div>
            <Div className="input-group">
                {
                    userInputSecondGroupInfo.map(
                        (info, index)=> {
                            let title = info.title;
                            let identifier = info.identifier;
                            let intialValue = userInput[info.identifier];

                            return (
                                <Input 
                                    key={index} 
                                    title={title} 
                                    identifier={identifier} 
                                    intialValue={intialValue} 
                                    onChangeInputValue={onChangeInputValue}
                                />
                            )
                        }
                    )
                }
            </Div>
        </section>
        )
}
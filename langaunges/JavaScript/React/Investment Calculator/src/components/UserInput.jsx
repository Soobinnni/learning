import Input from "./Input"
import Div from "../Div.jsx"

export default function UserInput({userInputInfo, userInput, onChangeInputValue}){
    let userInputFirstGroupInfo = [userInputInfo[0], userInputInfo[1]];
    let userInputSecondGroupInfo = [userInputInfo[2], userInputInfo[3]];
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
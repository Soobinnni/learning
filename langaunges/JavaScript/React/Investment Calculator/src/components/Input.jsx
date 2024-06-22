export default function Input({title, identifier, intialValue, onChangeInputValue}){
    return( 
        <p>
            <label htmlFor="">{title}</label>
            <input 
                type="number" 
                onChange={(e)=>onChangeInputValue(identifier, e.target.value)} 
                required 
                defaultValue={intialValue}
            />
        </p>
    )
}
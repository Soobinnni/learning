export default function Input({label, invalid, ...props}){
    let labelClasses = "block mb-2 text-xs font-bold tracking-wide uppercase ";
    let inputClasses = "w-full px-3 py-2 leading-tight boarder rounded shadow ";
    if(invalid){
        labelClasses += "text-stone-200";
        inputClasses += "text-gray-700 bg-stone-300";
    } else {
        labelClasses += "text-red-400";
        inputClasses += "text-red-500 bg-red-100 border-red-300";
    }
    return (
        <p>
            <label className={labelClasses}>{label}</label>
            <input className={inputClasses} {...props} />
        </p>
    )
}
export default function LoginInputField ({ name, placeholder, onChange, value, type="text" }) {
    return(<div className="mb-5">
        <p className="text-white pl-2 mb-1">{name}</p>
        <input 
            className="w-[100%] text-white border-b-2 border-white pb-1 pl-0.5"
            type={type} 
            placeholder={placeholder} 
            onChange={onChange} 
            value={value}
        />
    </div>)
}
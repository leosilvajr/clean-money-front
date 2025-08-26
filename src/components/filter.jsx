import { Search } from "lucide-react";
export default function Filter({ value , onChange, placeholder }) {

    return (
        <div className="input">
            <Search
                size={20}
                className="text-slate-300"
            />
            <input
                type="text"
                name="Busca"
                id="busca"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
            />
        </div>
    )
}

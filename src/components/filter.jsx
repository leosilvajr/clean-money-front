import { Search } from "lucide-react";

export default function Filter({ value, onChange, placeholder }) {
  return (
    <div className="relative w-1/4">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        type="text"
        name="busca"
        id="busca"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 rounded-md bg-transparent border border-gray-200 text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

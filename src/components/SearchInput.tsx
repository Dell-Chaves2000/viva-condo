import { IconType } from "react-icons";

interface SearchInputProps {
  placeholder: string;
  icon: IconType;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchInput({
  placeholder,
  icon: Icon,
  value,
  onChange,
  className = ""
}: SearchInputProps) {
  return (
    <div className={`relative w-64 ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    </div>
  );
}
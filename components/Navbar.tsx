import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow flex items-center justify-between p-4">
      <Link href="/">
        <span className="font-bold text-xl tracking-tight">WiseCipher</span>
      </Link>
      <div>
        <Link href="/dashboard" className="text-gray-700 hover:underline mr-4">Dashboard</Link>
        <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    </nav>
  );
}

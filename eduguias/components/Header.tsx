import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            {/* Graduation cap icon */}
            <svg
              className="h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
            <span className="text-xl font-bold text-gray-800">EduGuias</span>
          </Link>
          <nav className="ml-10 hidden items-center space-x-8 md:flex">
            <Link href="/" className="text-gray-600 hover:text-blue-500" style={{ textDecoration: 'underline' }}>
              Inicio
            </Link>
            <Link href="/plantillas" className="text-gray-600 hover:text-blue-500">
              Plantillas
            </Link>
            <Link href="/guias" className="text-gray-600 hover:text-blue-500">
              Guias
            </Link>
          </nav>
        </div>
        <div className="hidden items-center space-x-2 md:flex">
          <Link
            href="/login"
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {/* Login icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h12m-4 8v-4m0-4V4"></path>
            </svg>
            <span>Iniciar sesión</span>
          </Link>
          <Link
            href="/signup"
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {/* User plus icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            <span>Crear cuenta</span>
          </Link>
        </div>
        <div className="md:hidden">
          <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
            {/* Hamburger icon */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};


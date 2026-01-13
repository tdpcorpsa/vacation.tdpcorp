export default function PublicPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Página Pública
        </h1>
        <p className="text-gray-600 text-center">
          Esta es una página de ejemplo que indica que es accesible
          públicamente.
        </p>
      </div>
    </div>
  )
}

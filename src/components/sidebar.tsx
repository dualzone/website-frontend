export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-700 border-r border-gray-800 p-4">
            <nav className="flex flex-col space-y-2">
                <a href="#" className="p-2 hover:bg-gray-600 rounded">
                    Dashboard
                </a>
                <a href="#" className="p-2 hover:bg-gray-600 rounded">
                    Settings
                </a>
                <a href="#" className="p-2 hover:bg-gray-600 rounded">
                    Connexion
                </a>
            </nav>
        </aside>
    )
}
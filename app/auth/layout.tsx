export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center w-full p-8">
            <header>
                <h1>Welcome to Notes App</h1>
            </header>
            <main>{children}</main>
        </div>
    );
}
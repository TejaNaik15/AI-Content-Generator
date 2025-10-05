import { useState } from "react";
import Button from "./Button";
import { Menu, MoveRight, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { logoutAPI } from "../../apis/user/usersAPI";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);

    // mutation for logout
    const mutation = useMutation({ 
        mutationFn: logoutAPI,
        onSuccess: () => {
            logout();
            navigate("/login");
        }
    });

    const handleLogout = () => {
        mutation.mutate();
    };
    // Merge navigation items from both navbars
    const publicNav = [
        { title: "Home", href: "/" },
        { title: "Features", href: "/features" },
        { title: "Pricing", href: "/plans" },
        { title: "About", href: "/about" },
    ];
    const privateNav = [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Generate Content", href: "/generate-content" },
        { title: "Pricing", href: "/plans" },
    ];
    const navItems = isAuthenticated ? privateNav : publicNav;
    return (
        <header className="w-full z-40 fixed top-0 left-0 bg-background">
            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
                {/* Desktop Navigation */}
                <nav className="justify-start items-center gap-4 lg:flex hidden flex-row">
                    {navItems.map((item) => (
                        <Link key={item.title} to={item.href}>
                            <Button variant="ghost">{item.title}</Button>
                        </Link>
                    ))}
                </nav>
                <div className="flex lg:justify-center">
                    {/* <p className="font-semibold">TWBlocks</p> */}
                </div>
                <div className="flex justify-end w-full gap-4">
                    {isAuthenticated ? (
                        <Button variant="outline" onClick={handleLogout}>Sign out</Button>
                    ) : (
                        <>
                            <div className="border-r hidden md:inline"></div>
                            <Link to="/login">
                                <Button variant="outline">Sign in</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Get started</Button>
                            </Link>
                        </>
                    )}
                </div>
                <div className="flex w-12 shrink lg:hidden items-end justify-end">
                    <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    {isOpen && (
                        <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
                            {navItems.map((item) => (
                                <Link key={item.title} to={item.href} className="flex justify-between items-center">
                                    <span className="text-lg">{item.title}</span>
                                    <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                                </Link>
                            ))}
                            {isAuthenticated ? (
                                <Button variant="outline" className="mt-4" onClick={handleLogout}>Sign out</Button>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="outline" className="mt-4">Sign in</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button className="mt-2">Get started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}


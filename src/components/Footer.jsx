import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <h1 className="text-2xl font-bold mb-4">Cattle Breed Project</h1>
                    <p className="text-gray-400">
                        Providing comprehensive information about various cattle breeds, their characteristics, and best practices for cattle farming.
                    </p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                    <ul>
                        <li className="mb-2"><a href="/about" className="hover:underline">About Us</a></li>
                        <li className="mb-2"><a href="/breeds" className="hover:underline">Breed Information</a></li>
                        <li className="mb-2"><a href="/guides" className="hover:underline">Farming Guides</a></li>
                        <li className="mb-2"><a href="/contact" className="hover:underline">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Contact</h2>
                    <p className="text-gray-400">Email: info@cattlebreedproject.com</p>
                    <p className="text-gray-400">Phone: (123) 456-7890</p>
                    <div className="flex space-x-4 mt-4">
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.2c-.966 0-1.5-.721-1.5-1.6 0-.879.546-1.6 1.533-1.6s1.5.721 1.5 1.6c0 .879-.533 1.6-1.5 1.6zm12.5 11.2h-3v-5.6c0-1.34-.026-3.066-1.867-3.066-1.867 0-2.153 1.458-2.153 2.973v5.693h-3v-10h2.878v1.367h.042c.401-.757 1.379-1.558 2.838-1.558 3.033 0 3.592 2.024 3.592 4.655v5.536z"/>
                            </svg>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.334 3.608 1.31.973.975 1.246 2.242 1.309 3.608.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.849c-.062 1.366-.334 2.633-1.31 3.608-.975.973-2.242 1.246-3.608 1.309-1.265.058-1.645.069-4.849.069s-3.584-.012-4.849-.07c-1.366-.062-2.633-.334-3.608-1.31-.973-.975-1.246-2.242-1.309-3.608-.058-1.265-.069-1.645-.069-4.849s.012-3.584.07-4.849c.062-1.366.334-2.633 1.31-3.608.975-.973 2.242-1.246 3.608-1.309 1.265-.058 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.012-4.947.072-1.281.06-2.42.272-3.284 1.136-.864.864-1.076 2.003-1.136 3.284-.06 1.28-.072 1.688-.072 4.947s.012 3.667.072 4.947c.06 1.281.272 2.42 1.136 3.284.864.864 2.003 1.076 3.284 1.136 1.28.06 1.688.072 4.947.072s3.667-.012 4.947-.072c1.281-.06 2.42-.272 3.284-1.136.864-.864 1.076-2.003 1.136-3.284.06-1.28.072-1.688.072-4.947s-.012-3.667-.072-4.947c-.06-1.281-.272-2.42-1.136-3.284-.864-.864-2.003-1.076-3.284-1.136-1.28-.06-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.207 0-4-1.793-4-4s1.793-4 4-4 4 1.793 4 4-1.793 4-4 4zm6.406-11.845c-.796 0-1.444.648-1.444 1.444s.648 1.445 1.444 1.445 1.444-.648 1.444-1.444-.648-1.445-1.444-1.445zm-.406 2.845c-.796 0-1.444-.648-1.444-1.444s.648-1.444 1.444-1.444 1.444.648 1.444 1.444-.648 1.444-1.444 1.444z"/>
                            </svg>
                        </a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M21.8 8s-.2-1.4-.8-2c-.7-.8-1.5-.8-1.9-.9-2.7-.2-6.7-.2-6.7-.2s-4 0-6.7.2c-.4 0-1.2 0-1.9.9-.6.6-.8 2-.8 2s-.2 1.6-.2 3.2v1.6c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.7.8 1.5.8 1.9.9 2.7.2 6.7.2 6.7.2s4 0 6.7-.2c.4 0 1.2 0 1.9-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6c0-1.6-.2-3.2-.2-3.2zm-12 6.5v-5l5 2.5-5 2.5z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-10 pt-4 text-center">
                <p className="text-gray-400">&copy; 2025 Cattle Breed Project. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
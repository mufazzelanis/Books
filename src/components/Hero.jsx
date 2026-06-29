import { title } from "framer-motion/client";
import React, { useEffect, useState } from "react";

const Hero = ({ searchQuery }) => {
    const [books] = useState([]);
    const [loading] = useState(false);
    const [currentPage] = useState(1);

    const itemsPerPage = 6;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=35&key=AIzaSyDhLI6vmoJqJGu6F4NT9sGHj6wusopkK8I`);
                if (!response.ok) throw new error('Failed to fetch');
                const data = await response.json();
                const mappedBooks = data.items?.map(item => ({
                    id: item.id,
                    title: item.volumeInfo.title || 'Untitled',
                    authors: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
                    categories: item.volumeInfo.categories?.join(', ') || 'General',
                    rating: item.volumeInfo.averageRating || 0,
                    pageCount: item.volumeInfo.pageCount || 'N/A',
                    printType: item.volumeInfo.printType || 'Unknown',
                    ratingsCount: item.volumeInfo.ratingsCount || 0,
                    imageUrl: item.volumeInfo.imageLinks?.thumbnail || '',
                    description: item.volumeInfo.description || '',
                    infoLink: item.volumeInfo.infoLink || '#',
                })) || [];
                let limitedBooks = mappedBooks.slice(0, 35);
                if (limitedBooks.length < 35) {
                    const missingCount = 35 - limitedBooks.length;
                    const dummyBooks = Array.from({ length: missingCount }, (_, i) => ({
                        dummy: true,
                        id: `dummy-${i}`
                    }))
                    limitedBooks = [...limitedBooks, ...dummyBooks]
                }
                setBooks(limitedBooks);
            }
            catch (error) {
                console.error('error fetching books:', error);
                const dummyBooks = Array.from({ length: 35 }, (_, i) => ({
                    dummy: true,
                    id: `dummy-${i}`
                }))
                setBooks(dummyBooks);


            } finally {
                setLoading();
            }

        }
        fetchBooks();
    }, [searchQuery])

    // Pagination
    const paginatedBooks = books.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPlaceholder = (title) => {
        const initials = title
            .split(' ')
            .slice(0, 3)
            .map(word => word[0]?.toUpperCase() || '')
            .join('');

        return `data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns="http://w3.org" width="600" height="900" viewBox="0 0 600 900">
<rect width="100%" height="100%" fill="#2D3748"/>
<text x="50%" y="50%" fill="#4A5568" font-family="monospace" font-size="80"
      text-anchor="middle" dominant-baseline="middle">${initials}</text>
</svg>`
        )}`;
    }

    return (
        <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="text-center text-white text-xl py-20">
                        Loading...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {paginatedBooks.length === 0 ? (
                            <div className="col-span-full flex justify-center">
                                <div className="group relative bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-dashed border-gray-700/50 flex items-center justify-center h-64 md:h-96 w-full">
                                    <p className="text-gray-400 text-sm md:text-base">
                                        No Book Found
                                    </p>
                                </div>
                            </div>
                        ) : (
                            paginatedBooks.map((book, index) => (
                                <div
                                    key={book.id || index}
                                    className="bg-gray-800 rounded-2xl p-4 text-white"
                                >
                                    <img
                                        src={
                                            book.volumeInfo?.imageLinks?.thumbnail ||
                                            "https://via.placeholder.com/150x220?text=No+Image"
                                        }
                                        alt={book.volumeInfo?.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />

                                    <h2 className="mt-4 text-lg font-bold">
                                        {book.volumeInfo?.title}
                                    </h2>

                                    <p className="text-sm text-gray-400">
                                        {book.volumeInfo?.authors?.join(", ") || "Unknown Author"}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hero;
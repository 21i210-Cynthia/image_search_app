import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const clientId = 'Uy2gsdBdsi8ITT-nIpLlSoJ2UA09FVxRRyjBHzaDM0E'; 

  
  const categories = [
    'nature',
    'technology',
    'business',
    'people',
    'animals',
    'food',
    'travel',
    'architecture',
    'fashion',
    'sports',
    'art',
    'health',
  ];

  const searchImages = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query, page: 1, per_page: 30 },
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
      });

      setImages(response.data.results);
      setPage(2); 
    } catch (error) {
      console.error('Error fetching data from Unsplash API', error);
    }
  };

  const loadMoreImages = async () => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query, page, per_page: 30 },
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
      });

      setImages([...images, ...response.data.results]); 
      setPage(page + 1); 
    } catch (error) {
      console.error('Error fetching more images', error);
    }
  };

  const handleCategoryChange = async (e) => {
    const category = e.target.value;
    setQuery(category); 
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: category, page: 1, per_page: 30 },
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
      });

      setImages(response.data.results);
      setPage(2); 
    } catch (error) {
      console.error('Error fetching category images', error);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image); 
  };

  const closeModal = () => {
    setSelectedImage(null); 
  };

  const handleImageShare = (image) => {
    if (navigator.share) {
      navigator.share({
        title: image.alt_description || 'Shared Image',
        text: 'Check out this image!',
        url: image.urls.full, 
      })
      .then(() => console.log('Image shared successfully!'))
      .catch((error) => console.error('Error sharing image:', error));
    } else {
      alert('Sharing is not supported in your browser.');
    }
  };

  return (
    <div className="app">
      <h1>Image Search App</h1>

      <form onSubmit={searchImages}>
        <input
          type="text"
          placeholder="Search for images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Category Selection Dropdown */}
      <select onChange={handleCategoryChange} defaultValue="">
        <option value="" disabled>Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>

      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-card" onClick={() => handleImageClick(image)}>
            <img src={image.urls.small} alt={image.alt_description} />
            <p>{image.alt_description}</p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {images.length > 0 && (
        <button onClick={loadMoreImages} className="load-more">
          Load More
        </button>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={selectedImage.urls.full} alt={selectedImage.alt_description} />
            
            {/* Share Button */}
            <button 
              className="share-button" 
              onClick={() => handleImageShare(selectedImage)}
            >
              Share Image
            </button>

            {/* Download Button */}
            <button 
              className="download-button"
              onClick={async () => {
                try {
                  const response = await fetch(selectedImage.urls.full); 
                  const blob = await response.blob(); 
                  const url = window.URL.createObjectURL(blob); 

                  const link = document.createElement('a'); 
                  link.href = url; 
                  link.download = selectedImage.alt_description || 'downloaded-image'; 
                  document.body.appendChild(link); 
                  link.click(); 
                  document.body.removeChild(link); 
                  window.URL.revokeObjectURL(url); 
                } catch (error) {
                  console.error('Error downloading the image', error);
                }
              }}
            >
              Download Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;